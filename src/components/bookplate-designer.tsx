import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Badge } from './3d-badge'

const ThreeDBadge = dynamic(() => import('./3d-badge').then((mod) => mod.Badge), { ssr: false })

const animals = ['Bat', 'Bear', 'Crow', 'Deer', 'Dolphin', 'Fox', 'Gecko', 'Moose', 'Moth', 'Owl', 'Rat', 'Skunk', 'Snake', 'Spider', 'Swan']
const stamps = ['Bison', 'Crow', 'Eagle', 'Elk', 'Hedgehog', 'Meerkat', 'Monkey', 'Moose', 'Rooster', 'Salmon', 'Swan', 'Wolf']

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function BookplateDesigner() {
  const [name, setName] = useState<string>('Your Name')
  const [font, setFont] = useState<string>('Arial')
  const [fontSize, setFontSize] = useState<number>(24)
  const [imageType, setImageType] = useState<'animal' | 'stamp'>('animal')
  const [selectedImage, setSelectedImage] = useState<string>('Bat')
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [foregroundColor, setForegroundColor] = useState<string>('#000000')
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [bookplateWidth, setBookplateWidth] = useState<number>(300)
  const [bookplateHeight, setBookplateHeight] = useState<number>(400)
  const [lines, setLines] = useState<string[]>(['Ex Libris'])
  const [strokes, setStrokes] = useState<any[]>([])
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawBookplate = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, bookplateWidth, bookplateHeight)

        if (showGrid) {
          ctx.strokeStyle = '#cccccc'
          ctx.lineWidth = 1
          for (let x = 0; x < bookplateWidth; x += 20) {
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, bookplateHeight)
            ctx.stroke()
          }
          for (let y = 0; y < bookplateHeight; y += 20) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(bookplateWidth, y)
            ctx.stroke()
          }
        }

        ctx.fillStyle = foregroundColor
        ctx.font = `${fontSize}px ${font}`
        ctx.textAlign = 'center'

        lines.forEach((line, index) => {
          ctx.fillText(line, bookplateWidth / 2, (index + 1) * fontSize * 1.5)
        })

        ctx.fillText(name, bookplateWidth / 2, bookplateHeight - fontSize)

        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.width / img.height
          const maxWidth = bookplateWidth * 0.6
          const maxHeight = bookplateHeight * 0.4
          let width = maxWidth
          let height = width / aspectRatio
          if (height > maxHeight) {
            height = maxHeight
            width = height * aspectRatio
          }
          const x = (bookplateWidth - width) / 2
          const y = (bookplateHeight - height) / 2
          ctx.drawImage(img, x, y, width, height)

          strokes.forEach(stroke => {
            ctx.beginPath()
            ctx.moveTo(stroke[0].x, stroke[0].y)
            for (let i = 1; i < stroke.length; i++) {
              ctx.lineTo(stroke[i].x, stroke[i].y)
            }
            ctx.stroke()
          })

          setGeneratedImageUrl(canvas.toDataURL())
        }
        img.src = `/images/${imageType}s/${selectedImage.toLowerCase()}.png`
      }
    }
  }

  useEffect(() => {
    drawBookplate()
  }, [imageType, selectedImage, font, fontSize, lines, backgroundColor, foregroundColor, showGrid, bookplateWidth, bookplateHeight, name, strokes])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setStrokes([...strokes, [{ x, y }]])
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setStrokes(prevStrokes => {
        const newStrokes = [...prevStrokes]
        newStrokes[newStrokes.length - 1].push({ x, y })
        return newStrokes
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookplate Designer</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={bookplateWidth}
            height={bookplateHeight}
            className="border border-gray-300"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          />
        </div>
        <div className="flex-1">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="font">Font</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="imageType">Image Type</Label>
                  <Select value={imageType} onValueChange={(value: 'animal' | 'stamp') => setImageType(value)}>
                    <SelectTrigger id="imageType">
                      <SelectValue placeholder="Select image type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="animal">Animal</SelectItem>
                      <SelectItem value="stamp">Stamp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="selectedImage">Selected Image</Label>
                  <Select value={selectedImage} onValueChange={setSelectedImage}>
                    <SelectTrigger id="selectedImage">
                      <SelectValue placeholder="Select image" />
                    </SelectTrigger>
                    <SelectContent>
                      {(imageType === 'animal' ? animals : stamps).map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="foregroundColor">Foreground Color</Label>
                  <Input
                    id="foregroundColor"
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showGrid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                  <Label htmlFor="showGrid">Show Grid</Label>
                </div>
                <div>
                  <Label htmlFor="bookplateWidth">Bookplate Width</Label>
                  <Input
                    id="bookplateWidth"
                    type="number"
                    value={bookplateWidth}
                    onChange={(e) => setBookplateWidth(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="bookplateHeight">Bookplate Height</Label>
                  <Input
                    id="bookplateHeight"
                    type="number"
                    value={bookplateHeight}
                    onChange={(e) => setBookplateHeight(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lines">Lines</Label>
                  {lines.map((line, index) => (
                    <Input
                      key={index}
                      value={line}
                      onChange={(e) => {
                        const newLines = [...lines]
                        newLines[index] = e.target.value
                        setLines(newLines)
                      }}
                      className="mb-2"
                    />
                  ))}
                  <Button onClick={() => setLines([...lines, ''])}>
                    Add Line
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="darkMode">Dark Mode</Label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="w-full h-[400px]">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <OrbitControls />
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <ThreeDBadge darkMode={darkMode} imageUrl={generatedImageUrl || undefined} />
                </Canvas>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}