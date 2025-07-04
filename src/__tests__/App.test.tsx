import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render the app title', () => {
    render(<App />)
    expect(screen.getByText('PromptForge')).toBeInTheDocument()
  })

  it('should render the app subtitle', () => {
    render(<App />)
    expect(screen.getByText('知識ベース管理アプリケーション')).toBeInTheDocument()
  })
})