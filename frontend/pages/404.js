import Link from 'next/link'
import Title from '../components/common/Title'

const Custom404 = () => {
  return (
    <>
      <Title title="Page Stolen 😳" />
      <main>
        <div className="text-center flex w-full h-screen items-center justify-center">
          <h1>Page not found ¯\(°_o)/¯</h1>
          <Link href={'/'}>
            <button>Back to Home</button>
          </Link>
        </div>
      </main>
    </>
  )
}
export default Custom404
