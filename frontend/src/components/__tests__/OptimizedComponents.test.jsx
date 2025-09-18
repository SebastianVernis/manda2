import { render, screen, fireEvent } from '@testing-library/react'
import { 
  OptimizedCard, 
  OptimizedBadge, 
  OptimizedList,
  OptimizedOrderItem,
  OptimizedStatsCard 
} from '../OptimizedComponents'

describe('OptimizedComponents', () => {
  describe('OptimizedCard', () => {
    it('renders card with title and content', () => {
      render(
        <OptimizedCard title="Test Title" content="Test Content" />
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('handles click events', () => {
      const handleClick = vi.fn()
      render(
        <OptimizedCard 
          title="Clickable Card" 
          content="Click me" 
          onClick={handleClick}
        />
      )
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies custom className', () => {
      const { container } = render(
        <OptimizedCard className="custom-class" content="Test" />
      )
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('OptimizedBadge', () => {
    it('renders with correct estado color', () => {
      render(<OptimizedBadge estado="entregado">Entregado</OptimizedBadge>)
      
      const badge = screen.getByText('Entregado')
      expect(badge).toHaveClass('bg-success')
    })

    it('handles different estados', () => {
      const testCases = [
        { estado: 'pendiente', expected: 'bg-secondary' },
        { estado: 'confirmado', expected: 'bg-info' },
        { estado: 'preparando', expected: 'bg-warning' },
        { estado: 'listo', expected: 'bg-primary' },
        { estado: 'cancelado', expected: 'bg-danger' }
      ]
      
      testCases.forEach(({ estado, expected }) => {
        const { unmount } = render(
          <OptimizedBadge estado={estado}>{estado}</OptimizedBadge>
        )
        
        const badge = screen.getByText(estado)
        expect(badge).toHaveClass(expected)
        
        unmount() // Clean up between tests
      })
    })
  })

  describe('OptimizedList', () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]

    it('renders list items correctly', () => {
      render(
        <OptimizedList
          items={mockItems}
          renderItem={(item) => <div key={item.id}>{item.name}</div>}
        />
      )
      
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('applies custom keyExtractor', () => {
      const keyExtractor = (item) => `custom-${item.id}`
      
      render(
        <OptimizedList
          items={mockItems}
          renderItem={(item) => <div>{item.name}</div>}
          keyExtractor={keyExtractor}
        />
      )
      
      // Check that items are rendered (keyExtractor affects internal keys)
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })
  })

  describe('OptimizedOrderItem', () => {
    const mockOrder = {
      _id: 'order-1',
      numero_pedido: 'P001',
      clienteId: { nombre: 'Juan Cliente' },
      total: 25.50,
      estado: 'entregado',
      ubicacion: { lat: -34.6, lng: -58.4 }
    }

    it('renders order information', () => {
      render(<OptimizedOrderItem order={mockOrder} />)
      
      expect(screen.getByText('P001')).toBeInTheDocument()
      expect(screen.getByText('Juan Cliente')).toBeInTheDocument()
      expect(screen.getByText('$25.50')).toBeInTheDocument()
      expect(screen.getByText('entregado')).toBeInTheDocument()
    })

    it('shows action buttons when enabled', () => {
      const onStatusUpdate = vi.fn()
      const onViewMap = vi.fn()
      
      render(
        <OptimizedOrderItem 
          order={mockOrder} 
          onStatusUpdate={onStatusUpdate}
          onViewMap={onViewMap}
          showActions={true}
        />
      )
      
      expect(screen.getByText('Actualizar')).toBeInTheDocument()
      expect(screen.getByText('Ver Mapa')).toBeInTheDocument()
    })

    it('handles null order gracefully', () => {
      const { container } = render(<OptimizedOrderItem order={null} />)
      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('OptimizedStatsCard', () => {
    it('renders stats with title and value', () => {
      render(
        <OptimizedStatsCard 
          title="Total Pedidos" 
          value={150}
          change="+10%"
          changeType="positive"
        />
      )
      
      expect(screen.getByText('Total Pedidos')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('+10%')).toBeInTheDocument()
    })

    it('formats numeric values correctly', () => {
      render(
        <OptimizedStatsCard 
          title="Revenue" 
          value={1500000}
        />
      )
      
      // Should format large numbers with locale
      expect(screen.getByText('1,500,000')).toBeInTheDocument()
    })

    it('applies correct change color classes', () => {
      const { rerender } = render(
        <OptimizedStatsCard 
          title="Test" 
          value={100}
          change="+5%"
          changeType="positive"
        />
      )
      
      expect(screen.getByText('+5%')).toHaveClass('text-success')
      
      rerender(
        <OptimizedStatsCard 
          title="Test" 
          value={100}
          change="-5%"
          changeType="negative"
        />
      )
      
      expect(screen.getByText('-5%')).toHaveClass('text-danger')
    })
  })
})