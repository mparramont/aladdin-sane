import React from 'react'

export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Celebrate David Bowie! </h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search albums"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden />
            <div className="sr-only" aria-live="polite" />
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <a href="/albums/1">David Bowie (1969)</a>
            </li>
            <li>
              <a href="/albums/2">The Man Who Sold the World</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail" />
    </>
  )
}
