import { MainRouter } from '@/app/router/MainRouter'
import { ModalProvider } from '@/shared/modal/ModalProvider'
import { ModalRenderer } from '@/shared/modal'

function App() {
  return (
    <ModalProvider>
      <MainRouter />
      <ModalRenderer />
    </ModalProvider>
  )
}

export default App