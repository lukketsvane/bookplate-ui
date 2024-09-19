"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { toPng } from 'html-to-image'

// Importing SVGs as React components
import Bat from '/public/animals/bat.svg'
import Bear from '/public/animals/bear.svg'
import Crow from '/public/animals/crow.svg'
import Deer from '/public/animals/deer.svg'
import Dolphin from '/public/animals/dolphin.svg'
import Fox from '/public/animals/fox.svg'
import Gecco from '/public/animals/gecco.svg'
import Moose from '/public/animals/moose.svg'
import Moth from '/public/animals/moth.svg'
import Owl from '/public/animals/owl.svg'
import Rat from '/public/animals/rat.svg'
import Skunk from '/public/animals/skunk.svg'
import Snake from '/public/animals/snake.svg'
import Spider from '/public/animals/spider.svg'
import Swan from '/public/animals/swan.svg'

const animalSvgs = {
  bat: Bat,
  bear: Bear,
  crow: Crow,
  deer: Deer,
  dolphin: Dolphin,
  fox: Fox,
  gecco: Gecco,
  moose: Moose,
  moth: Moth,
  owl: Owl,
  rat: Rat,
  skunk: Skunk,
  snake: Snake,
  spider: Spider,
  swan: Swan,
}

const animals = [
  "bat", "bear", "crow", "deer", "dolphin", "fox", "gecco", "moose", "moth", "owl", "rat", "skunk", "snake", "spider", "swan"
]

const colors = [
  { name: 'Red', value: '#EA4129' },
  { name: 'Light Blue', value: '#77C8E0' },
  { name: 'White', value: '#FBFDFD' },
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

export default function BookplateDesigner() {
  const [selectedAnimal, setSelectedAnimal] = useState(() => animals[Math.floor(Math.random() * animals.length)])
  const [userName, setUserName] = useState('Iver Finne')
  const [backgroundColor, setBackgroundColor] = useState(colors[2].value) // Default to White
  const [foregroundColor, setForegroundColor] = useState(colors[0].value) // Default to Red
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [fontSize, setFontSize] = useState(16)
  const [size, setSize] = useState({ width: 300, height: 450 })
  const [strokes, setStrokes] = useState<StrokeSettings[]>([
    { style: 'solid', width: 19, dashLength: 0, gap: 0, dashCap: 'butt', join: 'miter', miterAngle: 28.96, color: colors[0].value }
  ])
  const [showTopDivider, setShowTopDivider] = useState(false);
  const [showBottomDivider, setShowBottomDivider] = useState(false);

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
    if (bookplateRef.current === null) {
      return
    }

    toPng(bookplateRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'bookplate.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
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
        strokeDasharray={
          stroke.style === 'dashed' ? `${stroke.dashLength} ${stroke.gap}` :
          stroke.style === 'dotted' ? '2 2' : undefined
        }
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
    setStrokes([...strokes, { style: 'solid', width: 19, dashLength: 0, gap: 0, dashCap: 'butt', join: 'miter', miterAngle: 28.96, color: colors[0].value }])
  }

  const removeStroke = (index: number) => {
    setStrokes(strokes.filter((_, i) => i !== index))
  }

  const updateStroke = (index: number, field: keyof StrokeSettings, value: string | number) => {
    const newStrokes = [...strokes]
    newStrokes[index] = { ...newStrokes[index], [field]: value }
    setStrokes(newStrokes)
  }

  const AnimalComponent = animalSvgs[selectedAnimal]

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Tabs */}
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full bg-black text-white grid-cols-2">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="strokes">Strokes</TabsTrigger>
            </TabsList>
            <TabsContent value="design">
              <Card className="bg-black text-white">
                <CardContent className="space-y-4 pt-4">
                  <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
                    <SelectTrigger className="bg-black">
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
                    className="bg-black"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Font</Label>
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger className="bg-black">
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
                    </div>
                    <div>
                      <Label>Font Size</Label>
                      <Input
                        type="number"
                        placeholder="Font size"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="bg-black"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showTopDivider}
                      onChange={(e) => setShowTopDivider(e.target.checked)}
                    />
                    <Label className="ml-2">Show Top Divider</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showBottomDivider}
                      onChange={(e) => setShowBottomDivider(e.target.checked)}
                    />
                    <Label className="ml-2">Show Bottom Divider</Label>
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex flex-wrap space-x-2 mt-1">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          className={`w-8 h-8 rounded-full ${backgroundColor === color.value ? 'ring-2 ring-offset-2' : ''}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setBackgroundColor(color.value)}
                          aria-label={`Select ${color.name}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Foreground Color</Label>
                    <div className="flex flex-wrap space-x-2 mt-1">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          className={`w-8 h-8 rounded-full ${foregroundColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setForegroundColor(color.value)}
                          aria-label={`Select ${color.name}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="strokes">
              <Card className="bg-black">
                <CardContent className="space-y-4 pt-4">
                  {strokes.map((stroke, index) => (
                    <div key={index} className="text-white mt-2 space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">Stroke {index + 1}</h3>
                        <Button onClick={() => removeStroke(index)} className="bg-black hover:bg-black"><MinusCircle className="mr-2" /> Remove</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={stroke.style} onValueChange={(value) => updateStroke(index, 'style', value)}>
                          <SelectTrigger className="bg-black">
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
                          className="bg-black"
                        />
                        {stroke.style !== 'solid' && (
                          <>
                            <Input
                              type="number"
                              placeholder="Dash length"
                              value={stroke.dashLength}
                              onChange={(e) => updateStroke(index, 'dashLength', parseInt(e.target.value))}
                              className="bg-black"
                            />
                            <Input
                              type="number"
                              placeholder="Gap"
                              value={stroke.gap}
                              onChange={(e) => updateStroke(index, 'gap', parseInt(e.target.value))}
                              className="bg-black"
                            />
                          </>
                        )}
                        <Select value={stroke.dashCap} onValueChange={(value) => updateStroke(index, 'dashCap', value)}>
                          <SelectTrigger className="bg-black">
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
                          <SelectTrigger className="bg-black">
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
                          className="bg-black"
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
                          </div>
                        </div>
                      </div>
                      <hr className="my-2" />
                    </div>
                  ))}
                  <Button onClick={addStroke} className="w-full bg-black hover:bg-black"><PlusCircle className="mr-2" /> Add Stroke</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Middle Column: Bookplate Preview */}
          <div
            ref={bookplateRef}
            className="relative overflow-hidden mx-auto"
            style={{ width: `${size.width}px`, height: `${size.height}px`, backgroundColor: backgroundColor }}
          >
            <svg width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
              {renderStrokes()}
              <g
                transform={`translate(${size.width * 0.2}, ${size.height * 0.05})`}
                fill={foregroundColor}
              >
                <AnimalComponent
                  width={size.width * 0.6}
                  height={size.width * 0.6}
                  style={{ maxWidth: '100%', maxHeight: '40%' }}
                />
              </g>
              {showTopDivider && (
                <line
                  x1="10%"
                  y1={size.height * 0.45}
                  x2="90%"
                  y2={size.height * 0.45}
                  stroke={foregroundColor}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}
              <text
                x="50%"
                y={size.height * 0.5}
                textAnchor="middle"
                fill={foregroundColor}
                fontSize={fontSize}
                fontFamily={selectedFont}
              >
                {userName}
              </text>
              {showBottomDivider && (
                <line
                  x1="10%"
                  y1={size.height * 0.55}
                  x2="90%"
                  y2={size.height * 0.55}
                  stroke={foregroundColor}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}
            </svg>
            <div
              className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
              onMouseDown={startResize}
            />
          </div>
          {/* Right Column: Download Button */}
          <div className="flex items-center justify-center">
            <Button onClick={handleDownload} className="p-2 bg-black hover:bg-white hover:text-black">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
