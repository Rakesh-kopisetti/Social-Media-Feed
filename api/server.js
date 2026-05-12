const http = require('http')
const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, 'db.json')
const port = Number(process.env.PORT || 8000)

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'))
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function nextPostId(posts) {
  const maxId = posts.reduce((max, post) => {
    const numericId = Number.parseInt(post.id, 10)
    return Number.isFinite(numericId) && numericId > max ? numericId : max
  }, 0)

  return String(maxId + 1)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = url

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  const db = readDb()

  if (req.method === 'GET' && pathname === '/') {
    sendJson(res, 200, { status: 'ok' })
    return
  }

  if (req.method === 'GET' && pathname === '/posts') {
    sendJson(res, 200, db.posts)
    return
  }

  if (req.method === 'GET' && pathname === '/users') {
    sendJson(res, 200, db.users)
    return
  }

  if (req.method === 'GET' && pathname === '/comments') {
    sendJson(res, 200, db.comments)
    return
  }

  if (req.method === 'POST' && pathname === '/posts') {
    try {
      const body = await readBody(req)
      const newPost = {
        id: nextPostId(db.posts),
        userId: Number(body.userId || 1),
        imageUrl: body.imageUrl || '',
        caption: body.caption || '',
        likes: Number(body.likes || 0),
        isLiked: Boolean(body.isLiked),
      }

      db.posts.unshift(newPost)
      writeDb(db)
      sendJson(res, 201, newPost)
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid request body' })
    }
    return
  }

  if (req.method === 'PATCH' && pathname.startsWith('/posts/')) {
    try {
      const postId = pathname.split('/')[2]
      const body = await readBody(req)
      const postIndex = db.posts.findIndex(post => String(post.id) === String(postId))

      if (postIndex === -1) {
        sendJson(res, 404, { error: 'Post not found' })
        return
      }

      db.posts[postIndex] = {
        ...db.posts[postIndex],
        ...body,
      }

      writeDb(db)
      sendJson(res, 200, db.posts[postIndex])
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid request body' })
    }
    return
  }

  sendJson(res, 404, { error: 'Not found' })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`API server listening on ${port}`)
})