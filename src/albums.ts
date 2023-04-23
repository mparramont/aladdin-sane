// adapted from https://gist.githubusercontent.com/ryanflorence/1e7f5d3344c0db4a8394292c157cd305/raw/f7ff21e9ae7ffd55bfaaaf320e09c6a08a8a6611/contacts.js

import localforage from 'localforage'
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'
import uniqBy from 'lodash.uniqby'

// TODO this is a hack so that we can later split on it. We should instead find a way to pass around the artist and album name separately.
export const separatorForAlbumID = '~|~'

export async function getTopAlbums(query?: string | null) {
  const albums = await Promise.all([
    getTopAlbumsFromLocalStorage(),
    getTopAlbumsFromLastFM()
  ]).then((arrays) => arrays.flat())

  const matchedAlbums = query
    ? matchSorter(albums, query, { keys: ['name'] })
    : albums

  return matchedAlbums.sort(sortBy('-last', 'createdAt'))
}

async function getTopAlbumsFromLocalStorage() {
  return (await localforage.getItem<TopAlbum[]>('topAlbums')) ?? []
}

export async function getTopAlbumsFromLastFM() {
  // get the top albums of David Bowie using the the Last.fm Scrobbler API
  const response = await fetch(
    'https://ws.audioscrobbler.com/2.0/' +
      '?method=artist.gettopalbums' +
      '&artist=David Bowie' +
      '&api_key=035db7391c866de91ad8767bbb32c4f7' +
      '&format=json'
  )

  const data = await response.json()
  const topAlbums = data.topalbums.album
  const uniqueTopAlbums = uniqBy(
    topAlbums,
    (album: LastFMAlbum) => album.mbid || `${album.artist.name}-${album.name}`
  )
  return uniqueTopAlbums.map((album: LastFMAlbum) =>
    buildTopAlbumFromLastFMTopAlbum(album)
  )
}

function buildTopAlbumFromLastFMTopAlbum(
  lastFMTopAlbum: LastFMTopAlbum
): TopAlbum {
  // TODO rename this to slug
  const id = encodeURIComponent(
    `${lastFMTopAlbum.artist.name}${separatorForAlbumID}${lastFMTopAlbum.name}`
  )
  // HACK this only works for albums with year in their name
  // TODO fetch the LastFMAlbum, and get the year from there (n+1 query issue though)
  const possibleYearFromName = lastFMTopAlbum.name.match(/\d{4}/)?.[0]
  const year = possibleYearFromName ? parseInt(possibleYearFromName, 10) : null
  return {
    id,
    createdAt: Date.now(), // TODO fix, this will be changed on every refresh
    ...lastFMTopAlbum,
    year,
    fromLastFM: true
  }
}

export async function getAlbum(id: string) {
  return (await getAlbumFromLocalStorage(id)) || (await getAlbumFromLastFM(id))
}

async function getAlbumFromLocalStorage(id: string) {
  const albums = await getAlbumsFromLocalStorage()
  const album = albums?.find((albumToFind) => albumToFind.id === id)
  return album ?? null
}

async function getAlbumsFromLocalStorage() {
  return localforage.getItem<Album[]>('albums')
}

async function getAlbumFromLastFM(id: string) {
  // get an album using the the Last.fm Scrobbler API
  const [artistName, albumName] = id.split(separatorForAlbumID)
  const response = await fetch(
    'https://ws.audioscrobbler.com/2.0/' +
      '?method=album.getInfo' +
      `&artist=${encodeURIComponent(artistName)}` +
      `&album=${encodeURIComponent(albumName)}` +
      '&api_key=035db7391c866de91ad8767bbb32c4f7' +
      '&format=json'
  )

  const { album } = (await response.json()) || {}
  return album && buildAlbumFromLastFMAlbum(album)
}

// duplicated and adapted from buildTopAlbumFromLastFMTopAlbum, TODO abstract?
function buildAlbumFromLastFMAlbum(lastFMAlbum: LastFMAlbum): TopAlbum {
  // TODO rename this to slug
  const id = encodeURIComponent(
    `${lastFMAlbum.artist.name}${separatorForAlbumID}${lastFMAlbum.name}`
  )
  return {
    id,
    createdAt: Date.now(), // TODO fix, this will be changed on every refresh
    ...lastFMAlbum,
    fromLastFM: true
  }
}

// TODO maybe it would make sense to differentiate between albums and albumsFromLastFM by calling Album LocalAlbum?
export async function createAlbum() {
  const id = Math.random().toString(36).substring(2, 9)
  const album = { id, createdAt: Date.now() }
  const albums = (await getAlbumsFromLocalStorage()) as Album[]
  // @ts-ignore TODO fix type when we use this
  albums.unshift(album)
  await set(albums)
  return album
}

export async function updateAlbum(id: string, updates: Partial<Album>) {
  const albums = await localforage.getItem<Album[]>('albums')
  if (!albums) throw new Error('No albums found')
  const albumIndex = albums.findIndex((album) => album.id === id)
  if (albumIndex === -1) throw new Error(`No album found for id ${id}`)
  const album = albums[albumIndex]
  const updatedAlbum = { ...album, ...updates }
  albums[albumIndex] = updatedAlbum
  await set(albums)
  return updatedAlbum
}

export async function deleteAlbum(id: string) {
  const albums = await localforage.getItem<Album[]>('albums')
  if (!albums) throw new Error('No albums found')
  const index = albums.findIndex((album) => album.id === id)
  if (index === -1) return false
  albums.splice(index, 1)
  await set(albums)
  return true
}

function set(albums: Album[]) {
  return localforage.setItem('albums', albums)
}
