"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const animals = [
  "bat", "bear", "crow", "deer", "dolphin", "fox", "gecco", "moose", "moth", "owl", "rat", "skunk", "snake", "spider", "swan"
]

const fonts = [
  'Arial, sans-serif',
  'Georgia, serif',
  'Courier New, monospace',
  'Brush Script MT, cursive',
  'Verdana, sans-serif',
]

const strokeStyles = [
  { name: 'Solid', value: 'solid' },
  { name: 'Dashed', value: 'dashed' },
  { name: 'Dotted', value: 'dotted' },
]

const dashCapStyles = [
  { name: 'Butt', value: 'butt' },
  { name: 'Round', value: 'round' },
  { name: 'Square', value: 'square' },
]

const joinStyles = [
  { name: 'Miter', value: 'miter' },
  { name: 'Round', value: 'round' },
  { name: 'Bevel', value: 'bevel' },
]

const lineNumbers = [3, 4, 5, 6, 7, 8, 9, 10]

interface StrokeSettings {
  style: string;
  width: number;
  dashLength: number;
  gap: number;
  dashCap: string;
  join: string;
  miterAngle: number;
}

export default function BookplateDesigner() {
  const [selectedAnimal, setSelectedAnimal] = useState(() => animals[Math.floor(Math.random() * animals.length)])
  const [userName, setUserName] = useState('Iver Finne')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [size, setSize] = useState({ width: 300, height: 450 })
  const [strokes, setStrokes] = useState<StrokeSettings[]>([
    { style: 'solid', width: 2, dashLength: 200, gap: 1200, dashCap: 'butt', join: 'miter', miterAngle: 28.96 }
  ])
  const [lineCount, setLineCount] = useState(5)
  const bookplateRef = useRef<HTMLDivElement>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [maxSize, setMaxSize] = useState({ width: 300, height: 450 })

  useEffect(() => {
    const updateMaxSize = () => {
      const parentRect = bookplateRef.current?.parentElement?.getBoundingClientRect()
      if (parentRect) {
        const maxWidth = Math.min(parentRect.width, window.innerWidth * 0.9)
        const maxHeight = window.innerHeight * 0.8
        setMaxSize({ width: maxWidth, height: maxHeight })
        setSize(prevSize => ({
          width: Math.min(prevSize.width, maxWidth),
          height: Math.min(prevSize.height, maxHeight)
        }))
      }
    }

    updateMaxSize()
    window.addEventListener('resize', updateMaxSize)
    return () => window.removeEventListener('resize', updateMaxSize)
  }, [])

  const handleDownload = () => {
    console.log('Downloading bookplate...')
  }

  const renderStrokes = () => {
    return strokes.map((stroke, index) => (
      <rect
        key={index}
        x="5"
        y="5"
        width={size.width - 10}
        height={size.height - 10}
        fill="none"
        stroke={foregroundColor}
        strokeWidth={stroke.width}
        strokeDasharray={stroke.style === 'dashed' ? `${stroke.dashLength} ${stroke.gap}` : stroke.style === 'dotted' ? '2 2' : undefined}
        strokeLinecap={stroke.dashCap}
        strokeLinejoin={stroke.join}
        strokeMiterlimit={stroke.miterAngle}
      />
    ))
  }

  const renderLines = () => {
    const lines = []
    const lineHeight = size.height * 0.05
    const startY = size.height * 0.6
    const endY = size.height * 0.9
    const availableHeight = endY - startY

    for (let i = 0; i < lineCount; i++) {
      lines.push(
        <line
          key={i}
          x1="10%"
          y1={startY + (i * availableHeight) / lineCount}
          x2="90%"
          y2={startY + (i * availableHeight) / lineCount}
          stroke={foregroundColor}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      )
    }
    return lines
  }

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setResizeStart({ x: e.clientX, y: e.clientY })
  }

  const stopResize = () => {
    setIsResizing(false)
  }

  const resize = (e: MouseEvent) => {
    if (!isResizing) return

    const deltaY = e.clientY - resizeStart.y

    let newHeight = size.height + deltaY
    const minHeight = size.width * 0.8 // Minimum height to prevent overlap
    newHeight = Math.max(minHeight, Math.min(maxSize.height, newHeight))
    setSize(prevSize => ({ ...prevSize, height: newHeight }))

    setResizeStart({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [isResizing])

  const addStroke = () => {
    setStrokes([...strokes, { style: 'solid', width: 2, dashLength: 200, gap: 1200, dashCap: 'butt', join: 'miter', miterAngle: 28.96 }])
  }

  const removeStroke = (index: number) => {
    setStrokes(strokes.filter((_, i) => i !== index))
  }

  const updateStroke = (index: number, field: keyof StrokeSettings, value: string | number) => {
    const newStrokes = [...strokes]
    newStrokes[index] = { ...newStrokes[index], [field]: value }
    setStrokes(newStrokes)
  }

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Create Your Own Bookplate</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="design" className="border border-black">Design</TabsTrigger>
              <TabsTrigger value="strokes" className="border border-black">Strokes</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <Card className="border-2 border-black">
                <CardContent className="space-y-4 pt-4">
                  <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue placeholder="Select an animal" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((animal) => (
                        <SelectItem key={animal} value={animal}>
                          {animal.charAt(0).toUpperCase() + animal.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border-2 border-black"
                  />
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font.split(',')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={lineCount.toString()} onValueChange={(value) => setLineCount(Number(value))}>
                    <SelectTrigger className="border-2 border-black">
                      <SelectValue placeholder="Number of lines" />
                    </SelectTrigger>
                    <SelectContent>
                      {lineNumbers.map((number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number} lines
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex space-x-2 mt-1">
                      <button
                        className={`w-8 h-8 border-2 border-black ${backgroundColor === '#FFFFFF' ? 'bg-white' : 'bg-black'}`}
                        onClick={() => setBackgroundColor(backgroundColor === '#FFFFFF' ? '#000000' : '#FFFFFF')}
                        aria-label="Toggle background color"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Foreground Color</Label>
                    <div className="flex space-x-2 mt-1">
                      <button
                        className={`w-8 h-8 border-2 border-black ${foregroundColor === '#000000' ? 'bg-black' : 'bg-white'}`}
                        onClick={() => setForegroundColor(foregroundColor === '#000000' ? '#FFFFFF' : '#000000')}
                        aria-label="Toggle foreground color"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="strokes">
              <Card className="border-2 border-black">
                <CardContent className="space-y-4 pt-4">
                  {strokes.map((stroke, index) => (
                    <div key={index} className="border-2 border-black p-2 mt-2">
                      <Select value={stroke.style} onValueChange={(value) => updateStroke(index, 'style', value)}>
                        <SelectTrigger className="border-2 border-black">
                          <SelectValue placeholder="Stroke style" />
                        </SelectTrigger>
                        <SelectContent>
                          {strokeStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Stroke width"
                        value={stroke.width}
                        onChange={(e) => updateStroke(index, 'width', parseInt(e.target.value))}
                        className="border-2 border-black mt-2"
                      />
                      <Input
                        type="number"
                        placeholder="Dash length"
                        value={stroke.dashLength}
                        onChange={(e) => updateStroke(index, 'dashLength', parseInt(e.target.value))}
                        className="border-2 border-black mt-2"
                      />
                      <Input
                        type="number"
                        placeholder="Gap"
                        value={stroke.gap}
                        onChange={(e) => updateStroke(index, 'gap', parseInt(e.target.value))}
                        className="border-2 border-black mt-2"
                      />
                      <Select value={stroke.dashCap} onValueChange={(value) => updateStroke(index, 'dashCap', value)}>
                        <SelectTrigger className="border-2 border-black mt-2">
                          <SelectValue placeholder="Dash cap" />
                        </SelectTrigger>
                        <SelectContent>
                          {dashCapStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={stroke.join} onValueChange={(value) => updateStroke(index, 'join', value)}>
                        <SelectTrigger className="border-2 border-black mt-2">
                          <SelectValue placeholder="Join" />
                        </SelectTrigger>
                        <SelectContent>
                          {joinStyles.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Miter angle"
                        value={stroke.miterAngle}
                        onChange={(e) => updateStroke(index, 'miterAngle', parseFloat(e.target.value))}
                        className="border-2 border-black mt-2"
                      />
                      <Button onClick={() => removeStroke(index)} className="mt-2 border-2 border-black"><MinusCircle /></Button>
                    </div>
                  ))}
                  <Button onClick={addStroke} className="border-2 border-black"><PlusCircle /></Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Button onClick={handleDownload} className="mt-4 border-2 border-black">Download Bookplate</Button>
        </div>
        <div 
          ref={bookplateRef}
          className="relative overflow-hidden mx-auto border-2 border-black"
          style={{ width: `${size.width}px`, height: `${size.height}px`, backgroundColor: backgroundColor }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
            {renderStrokes()}
            <image
              href={`/animals/${selectedAnimal}.svg`}
              width={size.width * 0.6}
              height={size.width * 0.6}
              x={size.width * 0.2}
              y={size.height * 0.05}
              fill={foregroundColor}
            />
            <text
              x="50%"
              y={size.height * 0.5}
              textAnchor="middle"
              fill={foregroundColor}
              fontSize={size.width * 0.08}
              fontFamily={selectedFont}
            >
              {userName}
            </text>
            {renderLines()}
          </svg>
          <div 
            className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize" 
            onMouseDown={startResize}
          />
        </div>
      </div>
    </div>
  )
}