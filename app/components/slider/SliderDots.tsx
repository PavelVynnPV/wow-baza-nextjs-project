interface SliderDotsProps {
    total: number
    current: number
    onChange: (index: number) => void
  }
  
  export default function SliderDots({ total, current, onChange }: SliderDotsProps) {
    const maxDots = 5
  
    const getVisibleDots = () => {
      if (total <= maxDots) return Array.from({ length: total }, (_, i) => i)
  
      let start = Math.max(0, current - Math.floor(maxDots / 2))
      let end = start + maxDots
  
      if (end > total) {
        end = total
        start = end - maxDots
      }
  
      return Array.from({ length: maxDots }, (_, i) => start + i)
    }
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', zIndex: '10', height:'10px'}}>
        {getVisibleDots().map(index => (
          <div
            key={index}
            onClick={() => onChange(index)}
            style={{
              width: current === index ? '12px' : '8px',
              height: current === index ? '12px' : '8px',
              borderRadius: '50%',
              backgroundColor: current === index ? '#ffffff' : '#888888',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    )
  }