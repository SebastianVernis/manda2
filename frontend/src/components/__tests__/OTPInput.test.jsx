import { render, screen } from '@testing-library/react'
import OTPInput from '../OTPInput'

describe('OTPInput', () => {
  it('renders verification heading and instructions', () => {
    render(
      <OTPInput
        telefono="123456789"
        email="test@example.com"
        tipo="verificacion"
        metodo="sms"
        autoSend={false}
        manualVerify={true}
      />
    )

    expect(screen.getByText('Verificación de Código')).toBeInTheDocument()
    expect(
      screen.getByText(/Ingresa el código de/i)
    ).toBeInTheDocument()
  })
})

