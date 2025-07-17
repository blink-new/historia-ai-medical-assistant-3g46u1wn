export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Historia AI</h1>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    </div>
  )
}