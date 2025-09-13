import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const onboardingSteps = [
    {
      title: "Bienvenido a YEGA",
      subtitle: "Tu aplicación de delivery favorita",
      description: "Descubre miles de restaurantes y tiendas cerca de ti. Comida deliciosa a solo un toque de distancia.",
      image: "/42.png"
    },
    {
      title: "Entrega rápida",
      subtitle: "En tiempo récord",
      description: "Recibe tus pedidos en tiempo record. Seguimiento en tiempo real de tu orden hasta tu puerta.",
      image: "/Running Orders.png"
    },
    {
      title: "Variedad infinita",
      subtitle: "Miles de opciones",
      description: "Explora una amplia variedad de restaurantes, desde comida casera hasta alta cocina internacional.",
      image: "/Food - Burgers.png"
    },
    {
      title: "¡Empecemos!",
      subtitle: "Todo listo para ordenar",
      description: "Regístrate o inicia sesión para comenzar a disfrutar de la mejor experiencia de delivery.",
      image: "/Home V.1.png"
    }
  ]

  const currentStepData = onboardingSteps[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/register')
    }
  }

  const handleSkip = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yega-dark via-yega-dark to-black flex flex-col">
      {/* Header */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" className="text-white/70" onClick={handleSkip}>
          Omitir
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Image */}
          <div className="mb-8">
            <img 
              src={currentStepData.image} 
              alt={currentStepData.title}
              className="w-64 h-64 mx-auto object-contain"
              onError={(e) => {
                e.target.src = "/42.png"
              }}
            />
          </div>

          {/* Text Content */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-yega-gold mb-2">
                {currentStepData.title}
              </h1>
              <h2 className="text-lg text-yega-silver mb-4">
                {currentStepData.subtitle}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {currentStepData.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6">
        {/* Dots Indicator */}
        <div className="flex justify-center mb-6 gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-yega-gold' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              className="flex-1 btn-yega-secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Anterior
            </Button>
          )}
          <Button 
            className="flex-1 btn-yega-primary"
            onClick={handleNext}
          >
            {currentStep === onboardingSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingScreen