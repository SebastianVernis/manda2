import React, { memo, useMemo } from 'react'
import { Card, Badge } from 'react-bootstrap'

// Optimized Card component with memoization
export const OptimizedCard = memo(({ 
  title, 
  content, 
  variant = 'yega', 
  onClick,
  className = '',
  children,
  ...props 
}) => {
  const cardClass = useMemo(() => 
    `card-${variant} ${className}`.trim(),
    [variant, className]
  )

  return (
    <Card 
      className={cardClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {title && <Card.Header>{title}</Card.Header>}
      <Card.Body>
        {content || children}
      </Card.Body>
    </Card>
  )
})

OptimizedCard.displayName = 'OptimizedCard'

// Optimized Badge with color memoization
export const OptimizedBadge = memo(({ 
  estado, 
  children, 
  className = '',
  ...props 
}) => {
  const badgeProps = useMemo(() => {
    const getEstadoColor = (estado) => {
      switch (estado) {
        case 'pendiente': return 'secondary'
        case 'confirmado': return 'info'
        case 'preparando': return 'warning'
        case 'listo': return 'primary'
        case 'en_camino': return 'info'
        case 'entregado': return 'success'
        case 'cancelado': return 'danger'
        default: return 'secondary'
      }
    }

    return {
      bg: getEstadoColor(estado),
      className: `badge-optimized ${className}`.trim()
    }
  }, [estado, className])

  return (
    <Badge {...badgeProps} {...props}>
      {children}
    </Badge>
  )
})

OptimizedBadge.displayName = 'OptimizedBadge'

// Optimized list component with virtualization for large datasets
export const OptimizedList = memo(({ 
  items = [], 
  renderItem, 
  keyExtractor = (item, index) => item.id || index,
  maxHeight = 400,
  itemHeight = 60,
  className = ''
}) => {
  const visibleItems = useMemo(() => {
    // For now, limit to first 50 items for performance
    // In production, implement virtual scrolling
    return items.slice(0, 50)
  }, [items])

  return (
    <div 
      className={`optimized-list ${className}`}
      style={{ 
        maxHeight, 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {visibleItems.map((item, index) => (
        <div 
          key={keyExtractor(item, index)}
          style={{ minHeight: itemHeight }}
          className="list-item-optimized"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
})

OptimizedList.displayName = 'OptimizedList'

// Memoized order item for better performance in lists
export const OptimizedOrderItem = memo(({ 
  order, 
  onStatusUpdate, 
  onViewMap,
  showActions = true 
}) => {
  const orderActions = useMemo(() => {
    if (!showActions || !order) return null

    return (
      <div className="d-flex gap-2 mt-2">
        {onStatusUpdate && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => onStatusUpdate(order._id)}
          >
            Actualizar
          </button>
        )}
        {onViewMap && order.ubicacion && (
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => onViewMap(order._id)}
          >
            Ver Mapa
          </button>
        )}
      </div>
    )
  }, [order, onStatusUpdate, onViewMap, showActions])

  if (!order) return null

  return (
    <OptimizedCard className="mb-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="mb-1">{order.numero_pedido}</h6>
          <p className="mb-1 text-muted small">
            {order.clienteId?.nombre || order.tiendaId?.nombre}
          </p>
          <p className="mb-0 fw-bold">${order.total?.toFixed(2)}</p>
        </div>
        <OptimizedBadge estado={order.estado}>
          {order.estado}
        </OptimizedBadge>
      </div>
      {orderActions}
    </OptimizedCard>
  )
})

OptimizedOrderItem.displayName = 'OptimizedOrderItem'

// Memoized stats card component
export const OptimizedStatsCard = memo(({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  className = ''
}) => {
  const changeColor = useMemo(() => {
    switch (changeType) {
      case 'positive': return 'text-success'
      case 'negative': return 'text-danger'
      case 'neutral': 
      default: return 'text-muted'
    }
  }, [changeType])

  const formattedValue = useMemo(() => {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return value
  }, [value])

  return (
    <OptimizedCard className={`stats-card ${className}`}>
      <div className="d-flex align-items-center">
        {icon && <div className="me-3 fs-4">{icon}</div>}
        <div className="flex-grow-1">
          <h6 className="mb-0 text-muted small">{title}</h6>
          <h4 className="mb-0">{formattedValue}</h4>
          {change && (
            <small className={changeColor}>
              {change}
            </small>
          )}
        </div>
      </div>
    </OptimizedCard>
  )
})

OptimizedStatsCard.displayName = 'OptimizedStatsCard'