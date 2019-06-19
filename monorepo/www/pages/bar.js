import Link from 'next/Link'

import 'isomorphic-unfetch'

const Page = ({now})=>(
  <>
    <div>
      <p>now is :{now}</p>
    </div>
    <div className="intro">
        <h2><Link href="/foo"><a>foo</a></Link></h2>      
    </div>
  </>
)

const baseUrl = ({req,...ctx})=>{
  if(ctx.res){
    const protocol = req.headers['x-forwarded-proto'];
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}/api`;
    return baseUrl;
  }else{
    const protocol = window.location.protocol;
    const host = window.location.host;
    const baseUrl = `${protocol}//${host}/api`;
    return baseUrl;
  }
}
Page.getInitialProps=async ({req, ...ctx})=>  {
  const now = await (await fetch(`${baseUrl({req, ...ctx})}/node/bar`)).text()
  return { now };
};

export default Page;