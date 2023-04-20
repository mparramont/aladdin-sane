// adapted from https://gist.githubusercontent.com/ryanflorence/1e7f5d3344c0db4a8394292c157cd305/raw/f7ff21e9ae7ffd55bfaaaf320e09c6a08a8a6611/contacts.js

import localforage from 'localforage'
import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

export async function getAlbums(query?: string) {
  const albums = await Promise.all([
    getAlbumsFromLocalStorage(),
    getAlbumsFromLastFM()
  ]).then((arrays) => arrays.flat())

  const matchedAlbums = query
    ? matchSorter(albums, query, { keys: ['first', 'last'] })
    : albums

  return matchedAlbums.sort(sortBy('-last', 'createdAt'))
}

async function getAlbumsFromLocalStorage() {
  return (await localforage.getItem<Album[]>('albums')) ?? []
}

export async function getAlbumsFromLastFM() {
  // Use fetch to make an HTTP request to the Last.fm API
  const response = await fetch(
    'https://ws.audioscrobbler.com/2.0/' +
      '?method=artist.gettopalbums' +
      '&artist=David Bowie' +
      '&api_key=035db7391c866de91ad8767bbb32c4f7' +
      '&format=json'
  )

  const data = await response.json()

  return data.topalbums.album.map((album: Album) => ({
    id: album.mbid || `${album.artist.name}-${album.name}`,
    name: album.name,
    artist: album.artist,
    createdAt: Date.now()
  }))
}

export async function createAlbum() {
  await fakeNetwork()
  const id = Math.random().toString(36).substring(2, 9)
  const album = { id, createdAt: Date.now() }
  const albums = (await getAlbums()) as Album[]
  // @ts-ignore TODO fix type when we use this
  albums.unshift(album)
  await set(albums)
  return album
}

export async function getAlbum(id: string) {
  await fakeNetwork(`album:${id}`)
  const albums = await localforage.getItem<Album[]>('albums')
  const album = albums?.find((albumToFind) => albumToFind.id === id)
  return album ?? null
}

export async function updateAlbum(id: string, updates: Partial<Album>) {
  await fakeNetwork()
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

interface FakeCache {
  [key: string]: boolean
}

let fakeCache: FakeCache = {}

async function fakeNetwork(key?: string) {
  if (!key) {
    fakeCache = {}
  }

  if (key && fakeCache[key]) {
    return
  }

  if (key) {
    fakeCache[key] = true
  }
  await new Promise((res) => {
    setTimeout(res, Math.random() * 800)
  })
}

function set(albums: Album[]) {
  return localforage.setItem('albums', albums)
}
