module.exports = {
  openSeedFile,
  openSeedDirectory,
  openTorrentFile,
  openTorrentAddress
}

var config = require('../config')
var electron = require('electron')
var windows = require('./windows')

/**
 * Show open dialog to create a single-file torrent.
 */
function openSeedFile () {
  if (!windows.main.win) return
  var opts = {
    title: 'Select a file for the torrent.',
    properties: [ 'openFile' ]
  }
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    windows.main.send('dispatch', 'showCreateTorrent', selectedPaths)
  })
}

/*
 * Show open dialog to create a single-file or single-directory torrent. On
 * Windows and Linux, open dialogs are for files *or* directories only, not both,
 * so this function shows a directory dialog on those platforms.
 */
function openSeedDirectory () {
  if (!windows.main.win) return
  var opts = process.platform === 'darwin'
    ? {
      title: 'Select a file or folder for the torrent.',
      properties: [ 'openFile', 'openDirectory' ]
    }
    : {
      title: 'Select a folder for the torrent.',
      properties: [ 'openDirectory' ]
    }
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    windows.main.send('dispatch', 'showCreateTorrent', selectedPaths)
  })
}

/*
 * Show open dialog to open a .torrent file.
 */
function openTorrentFile () {
  if (!windows.main.win) return
  var opts = {
    title: 'Select a .torrent file to open.',
    filters: [{ name: 'Torrent Files', extensions: ['torrent'] }],
    properties: [ 'openFile', 'multiSelections' ]
  }
  setTitle(opts.title)
  electron.dialog.showOpenDialog(windows.main.win, opts, function (selectedPaths) {
    resetTitle()
    if (!Array.isArray(selectedPaths)) return
    selectedPaths.forEach(function (selectedPath) {
      windows.main.send('dispatch', 'addTorrent', selectedPath)
    })
  })
}

/*
 * Show modal dialog to open a torrent URL (magnet uri, http torrent link, etc.)
 */
function openTorrentAddress () {
  windows.main.send('showOpenTorrentAddress')
}

/**
 * Dialogs on do not show a title on OS X, so the window title is used instead.
 */
function setTitle (title) {
  if (process.platform === 'darwin') {
    windows.main.send('dispatch', 'setTitle', title)
  }
}

function resetTitle () {
  setTitle(config.APP_WINDOW_TITLE)
}
