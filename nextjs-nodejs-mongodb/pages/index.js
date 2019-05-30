// Dependencies
import { useEffect, useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'

// Components
import Signature from '../components/Signature'

HomePage.getInitialProps = async ctx => {
  const { req, query } = ctx
  const protocol = req
    ? `${req.headers['x-forwarded-proto']}:`
    : location.protocol
  const host = req ? req.headers['x-forwarded-host'] : location.host
  const baseURL = `${protocol}//${host}`
  const guestbookRequest = await fetch(
    `${baseURL}/api/guestbook?page=${query.page}&limit=${query.limit}`
  )
  const { guestbook, page, pageCount } = await guestbookRequest.json()
  const options = {
    maxAge: 30 * 24 * 60 * 60,
    path: '/'
  }
  let props = { guestbook, page, pageCount }

  if (query.token === 'logout') {
    destroyCookie(ctx, 'token')
    destroyCookie(ctx, 'id')
    destroyCookie(ctx, 'name')
    return props
  }

  if (query.id) {
    await setCookie(ctx, 'id', query.id, options)
    await setCookie(ctx, 'login', query.login, options)
    await setCookie(ctx, 'token', query.token, options)
    const { id, login, token } = query
    props = { ...props, id, login, token }
  } else {
    const { id, login, token } = await parseCookies(ctx)
    props = { ...props, id, login, token }
  }

  return props
}

function HomePage({
  baseURL,
  guestbook,
  id,
  login,
  pageCount,
  token,
  router
}) {
  const [signatures, setSignatures] = useState([])
  const [signatureSubmitted, setSignatureSubmitted] = useState({})
  const existing = signatures.find(s => s.id == id)

  useEffect(() => {
    if (router.query.token) {
      router.replace('/', '/', { shallow: true })
    }

    if (router.query.page > pageCount) {
      router.replace({pathname: router.pathname, query: Object.assign(router.query, {page: pageCount})}, { shallow: true})
    }

    setSignatures([...guestbook])
  }, [guestbook])

  const handleSubmit = async e => {
    e.preventDefault()
    let signature = e.target.signature.value
    e.target.signature.value = ''

    const res = await fetch(`/api/guestbook`, {
      method: 'PATCH',
      body: JSON.stringify({
        signature,
        id,
        user: login
      })
    })

    if (res.status === 200) {
      setSignatureSubmitted({status: true})

      if (existing) {
        const updatedSignatures = signatures.map(s => {
          if (s.id === existing.id) s.signature = signature
          return s
        })

        setSignatures(updatedSignatures)
      } else {
        const newSignature = await res.json()
        const updatedSignatures = [newSignature, ...signatures.slice(0, 4)]
        setSignatures(updatedSignatures)
      }
    } else {
      setSignatureSubmitted({status: false, message: res.message})
    }
  }

  const handleDelete = async () => {
    const res = await fetch(
      `/api/guestbook?id=${id}&page=${page}&limit=5`,
      {
        method: 'DELETE'
      }
    )

    if (res.status === 200) {
      const data = await res.json()
      setSignatures([...data.guestbook])
    }
  }

  const page = parseInt(router.query.page) || 1

  const previousParams = {
    ...(router.query.limit && { limit: router.query.limit }),
    ...((page - 1 >= 1 && { page: page - 1}) || (page - 1 === 1 && null))
  }

  const nextParams = {
    ...(router.query.limit && { limit: router.query.limit }),
    ...(page + 1 <= pageCount && { page: page + 1})
  }

  const esc = encodeURIComponent
  const buildParams = (params) => Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&')

  const nextPageLink = `/?${buildParams(nextParams)}`
  const previousPageLink = `/?${buildParams(previousParams)}`

  return (
    <>
      <Head>
        <title>GitHub Guestbook</title>
        <link
          rel="stylesheet"
          href="https://css.zeit.sh/v1.css"
          type="text/css"
        />
      </Head>
      <header>
        <h1>GitHub Guestbook</h1>
        <Link
          href={
            !token ? `${baseURL}/api/auth/index.js` : `/?token=logout`
          }
        >
          <a>
            <button>
              {token !== undefined ? 'Logout' : 'Login With GitHub'}
            </button>
          </a>
        </Link>
      </header>
      {token && (
        <>
          <h3>
            Hello, {login},{' '}
            {!!existing
              ? 'want to update your signature?'
              : 'want to sign the guestbook?'}
          </h3>
          <form onSubmit={handleSubmit}>
            <input id="signature" name="signature" />
            <button type="submit">Sign</button>
          </form>
          <span>{ signatureSubmitted && (signatureSubmitted.status === true ? '' : signatureSubmitted.message) }</span>
        </>
      )}
      {guestbook.length >= 1 && (
        <>
          <h2>Signatures</h2>
          <div className="signatures-list">
            {guestbook.map(g => (
              <Signature
                id={g.id}
                loggedInId={id}
                signature={g.signature}
                user={g.user}
                updated={g.updated}
                key={g.id}
                handleDelete={handleDelete}
                />
            ))}
          </div>
        </>
      )}
      {
      }

      <nav>
        {previousParams.page && (
          <Link prefetch href={previousPageLink}>
            <a>Previous</a>
          </Link>
        )}
        {nextParams.page && (
          <Link prefetch href={nextPageLink}>
            <a className="next">Next</a>
          </Link>
        )}
      </nav>
      <style jsx>{`
        header {
          align-items: center;
          display: flex;
          justify-content: space-between;
        }

        .signatures-list {
          margin-left: 0;
        }

        ul li::before {
          content: '';
        }

        form {
          display: flex;
          width: 100%;
        }

        input {
          flex-grow: 100;
          margin-right: 20px;
        }

        nav {
          display: flex;
          justify-content: space-between;
        }

        .next {
          margin-left: auto;
        }
      `}</style>
    </>
  )
}

export default withRouter(HomePage)