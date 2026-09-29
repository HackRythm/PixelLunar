interface Props {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  duration?: number
}

export default function DecodeText({
  text,
  className = '',
  as: Tag = 'span',
}: Props) {
  return <Tag className={className}>{text}</Tag>
}
