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

const animalSvgs = {
  bat: `<path d="M12 1a1 1 0 0 1 .993.883L13 2v5h1V4a1 1 0 0 1 1.993-.117L16 4v3h1V5a1 1 0 0 1 1.993-.117L19 5v4a8 8 0 0 1-7.391 7.984l-.154.006a6.979 6.979 0 0 1-3.097-.718l-.258-.133-.252.114a6.97 6.97 0 0 1-2.848.723V17a1 1 0 0 1-.883.993L5 18a1 1 0 0 1-.993-.883L4 17v-.061a8 8 0 0 1-3-6.223l-.007-.194V6a1 1 0 0 1 1.993-.117L3 6v1h1V4a1 1 0 0 1 1.993-.117L6 4v3h1V2a1 1 0 0 1 1.993-.117L9 2v5h3V2a1 1 0 0 1 1-1zm-1 9.188V16a1 1 0 0 0 1.993.117L13 16v-5.812a6.037 6.037 0 0 1-2 0z"/>`,
  bear: `<path d="M15.375 8.863a3.868 3.868 0 0 1-3.375 3.868v1.11c.044.367.106.73.186 1.09.13.64.32 1.26.57 1.86.1.21.21.42.33.63.21.32.45.63.71.92.13.13.26.26.4.38.23.17.47.33.73.47.16.07.33.14.5.2.13.03.25.06.38.08.11 0 .21 0 .32-.03.11-.04.22-.09.32-.15.12-.09.23-.19.33-.3.12-.13.22-.28.31-.43.1-.18.19-.37.26-.57.09-.25.16-.5.21-.77.04-.2.07-.41.09-.62.01-.14.02-.28.02-.42v-.34c0-.09 0-.17-.01-.26 0-.13-.02-.25-.04-.38-.03-.2-.07-.39-.13-.58-.05-.18-.12-.35-.2-.52-.06-.13-.13-.25-.21-.37-.06-.09-.13-.17-.2-.25-.05-.06-.11-.11-.17-.16-.05-.04-.11-.07-.17-.1-.05-.02-.11-.03-.16-.03-.04 0-.08.01-.12.03-.03.01-.06.03-.08.06-.02.02-.03.04-.04.07 0 .03 0 .06.02.09.03.05.07.1.11.14.08.08.15.16.21.25.08.12.15.25.2.38.06.15.1.31.12.47.02.13.02.27.01.4 0 .07-.01.14-.03.21-.02.09-.06.17-.11.25-.06.1-.14.19-.23.27-.08.07-.18.12-.28.16-.12.04-.24.06-.37.06-.17 0-.33-.03-.49-.08-.2-.07-.39-.16-.57-.27-.23-.14-.44-.31-.63-.5-.24-.24-.45-.5-.63-.79-.2-.32-.37-.66-.5-1.02-.13-.35-.22-.71-.28-1.08-.03-.19-.05-.39-.06-.58v-1.11a3.868 3.868 0 0 1-3.375-3.868 3.87 3.87 0 0 1 7.75 0zm-3.875-6A5.994 5.994 0 0 0 6 8.863a5.994 5.994 0 0 0 5.5 5.968v.638c-.044.37-.106.735-.186 1.098a8.978 8.978 0 0 1-.57 1.87c-.1.21-.21.42-.33.63-.21.32-.45.63-.71.92-.13.13-.26.26-.4.38-.23.17-.47.33-.73.47-.16.07-.33.14-.5.2-.13.03-.25.06-.38.08-.11 0-.21 0-.32-.03-.11-.04-.22-.09-.32-.15-.12-.09-.23-.19-.33-.3-.12-.13-.22-.28-.31-.43-.1-.18-.19-.37-.26-.57-.09-.25-.16-.5-.21-.77-.04-.2-.07-.41-.09-.62-.01-.14-.02-.28-.02-.42v-.34c0-.09 0-.17.01-.26 0-.13.02-.25.04-.38.03-.2.07-.39.13-.58.05-.18.12-.35.2-.52.06-.13.13-.25.21-.37.06-.09.13-.17.2-.25.05-.06.11-.11.17-.16.05-.04.11-.07.17-.1.05-.02.11-.03.16-.03.04 0 .08.01.12.03.03.01.06.03.08.06.02.02.03.04.04.07 0 .03 0 .06-.02.09-.03.05-.07.1-.11.14-.08.08-.15.16-.21.25-.08.12-.15.25-.2.38-.06.15-.1.31-.12.47-.02.13-.02.27-.01.4 0 .07.01.14.03.21.02.09.06.17.11.25.06.1.14.19.23.27.08.07.18.12.28.16.12.04.24.06.37.06.17 0 .33-.03.49-.08.2-.07.39-.16.57-.27.23-.14.44-.31.63-.5.24-.24.45-.5.63-.79.2-.32.37-.66.5-1.02.13-.35.22-.71.28-1.08.03-.19.05-.39.06-.58v-1.11A5.994 5.994 0 0 0 18 8.863a5.994 5.994 0 0 0-5.5-5.968V2.863z"/>`,
  crow: `<path d="M11 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 4.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM4.5 22a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm15-6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm-3-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>`,
  // Add more animal SVG paths here...
}

const colors = [
  { name: 'Red', value: '#EF4444' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Light Blue', value: '#7DD3FC' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#FBBF24' },
  { name: 'Purple', value: '#8B5CF6' },
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

interface StrokeSettings {
  style: string;
  width: number;
  dashLength: number;
  gap: number;
  dashCap: string;
  join: string;
  miterAngle: number;
  color: string;
}

export default function Component() {
  const [selectedAnimal, setSelectedAnimal] = useState(() => animals[Math.floor(Math.random() * animals.length)])
  const [userName, setUserName] = useState('Iver Finne')
  const [backgroundColor, setBackgroundColor] = useState(colors[0].value)
  const [foregroundColor, setForegroundColor] = useState(colors[1].value)
  const [customColor, setCustomColor] = useState('#000000')
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [size, setSize] = useState({ width: 300, height: 450 })
  const [strokes, setStrokes] = useState<StrokeSettings[]>([
    { style: 'dotted', width: 2, dashLength: 200, gap: 1200, dashCap: 'butt', join: 'miter', miterAngle: 28.96, color: colors[1].value }
  ])
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
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeDasharray={stroke.style === 'dashed' ? `${stroke.dashLength} ${stroke.gap}` : stroke.style === 'dotted' ? '2 2' : undefined}
        strokeLinecap={stroke.dashCap}
        strokeLinejoin={stroke.join}
        strokeMiterlimit={stroke.miterAngle}
      />
    ))
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
    setStrokes([...strokes, { style: 'solid', width: 2, dashLength: 200, gap: 1200, dashCap: 'butt', join: 'miter', miterAngle: 28.96, color: colors[1].value }])
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
    <div className="container mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Create Your Own Bookplate</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="strokes">Strokes</TabsTrigger>
          </TabsList>
          <TabsContent value="design">
            <Card className="bg-gray-800">
              <CardContent className="space-y-4 pt-4">
                <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                  <SelectTrigger className="bg-gray-700">
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
                  className="bg-gray-700"
                />
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="bg-gray-700">
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
                <div>
                  <Label>Background Color</Label>
                  <div className="flex space-x-2 mt-1">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-8 h-8 rounded-full ${backgroundColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setBackgroundColor(color.value)}
                        aria-label={`Select ${color.name}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value)
                        setBackgroundColor(e.target.value)
                      }}
                      className="w-8 h-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>Foreground Color</Label>
                  <div className="flex space-x-2 mt-1">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-8 h-8 rounded-full ${foregroundColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setForegroundColor(color.value)}
                        aria-label={`Select ${color.name}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value)
                        setForegroundColor(e.target.value)
                      }}
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="strokes">
            <Card className="bg-gray-800">
              <CardContent className="space-y-4 pt-4">
                {strokes.map((stroke, index) => (
                  <div key={index} className="border border-gray-700 p-2 mt-2 grid grid-cols-2 gap-2">
                    <Select value={stroke.style} onValueChange={(value) => updateStroke(index, 'style', value)}>
                      <SelectTrigger className="bg-gray-700">
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
                      className="bg-gray-700"
                    />
                    <Input
                      type="number"
                      placeholder="Dash length"
                      value={stroke.dashLength}
                      onChange={(e) => updateStroke(index, 'dashLength', parseInt(e.target.value))}
                      className="bg-gray-700"
                    />
                    <Input
                      type="number"
                      placeholder="Gap"
                      value={stroke.gap}
                      onChange={(e) => updateStroke(index, 'gap', parseInt(e.target.value))}
                      className="bg-gray-700"
                    />
                    <Select value={stroke.dashCap} onValueChange={(value) => updateStroke(index, 'dashCap', value)}>
                      <SelectTrigger className="bg-gray-700">
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
                      <SelectTrigger className="bg-gray-700">
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
                      className="bg-gray-700"
                    />
                    <div className="col-span-2">
                      <Label>Stroke Color</Label>
                      <div className="flex space-x-2 mt-1">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            className={`w-6 h-6 rounded-full ${stroke.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => updateStroke(index, 'color', color.value)}
                            aria-label={`Select ${color.name}`}
                          />
                        ))}
                        <input
                          type="color"
                          value={stroke.color}
                          onChange={(e) => updateStroke(index, 'color', e.target.value)}
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                    <Button onClick={() => removeStroke(index)} className="col-span-2 bg-red-600 hover:bg-red-700"><MinusCircle className="mr-2" /> Remove Stroke</Button>
                  </div>
                ))}
                <Button onClick={addStroke} className="w-full bg-green-600 hover:bg-green-700"><PlusCircle className="mr-2" /> Add Stroke</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div 
          ref={bookplateRef}
          className="relative overflow-hidden mx-auto"
          style={{ width: `${size.width}px`, height: `${size.height}px`, backgroundColor: backgroundColor }}
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
            {renderStrokes()}
            <svg
              width={size.width * 0.6}
              height={size.width * 0.6}
              viewBox="0 0 24 24"
              x={size.width * 0.2}
              y={size.height * 0.05}
              fill={foregroundColor}
            >
              {animalSvgs[selectedAnimal as keyof typeof animalSvgs] && (
                <g dangerouslySetInnerHTML={{ __html: animalSvgs[selectedAnimal as keyof typeof animalSvgs] }} />
              )}
            </svg>
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
            <line
              x1="10%"
              y1={size.height * 0.7}
              x2="90%"
              y2={size.height * 0.7}
              stroke={foregroundColor}
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </svg>
          <div 
            className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize" 
            onMouseDown={startResize}
          />
        </div>
      </div>
      <Button onClick={handleDownload} className="mt-4 bg-blue-600 hover:bg-blue-700">Download Bookplate</Button>
    </div>
  )
}