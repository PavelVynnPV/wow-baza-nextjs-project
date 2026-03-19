export default function Loader() {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-loading.gif" alt="logo" className="w-full h-20 animate-pulse" />
        </div>
      </div>
    )
  }