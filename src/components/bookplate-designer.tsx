"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Undo2, Redo2, Copy, Share2, Download, Plus, X, Moon, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'

const ThreeDBadge = dynamic(() => import('./3d-badge'), { ssr: false })

const animals = ['Bat', 'Bear', 'Crow', 'Deer', 'Dolphin', 'Fox', 'Gecko', 'Moose', 'Moth', 'Owl', 'Rat', 'Skunk', 'Snake', 'Spider', 'Swan']
const stamps = ['Bison', 'Crow', 'Eagle', 'Elk', 'Hedgehog', 'Meerkat', 'Monkey', 'Moose', 'Rooster', 'Salmon', 'Swan', 'Wolf']
const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']
const strokeTypes = ['Solid', 'Dashed', 'Dotted']
const strokeStyles = ['Butt', 'Round', 'Square']
const strokeJoins = ['Miter', 'Round', 'Bevel']
const colorPresets = ['#FF0000', '#00FFFF', '#FFFFFF', '#000000']

type Stroke = {
  type: string;
  width: number;
  dashArray: number;
  dashOffset: number;
  style: string;
  join: string;
  color: string;
}

const strokePresets = {
  'Thin Solid': { type: 'Solid', width: 1, dashArray: 0, dashOffset: 0, style: 'Butt', join: 'Miter', color: '#000000' },
  'Thick Solid': { type: 'Solid', width: 5, dashArray: 0, dashOffset: 0, style: 'Butt', join: 'Miter', color: '#000000' },
  'Dashed': { type: 'Dashed', width: 2, dashArray: 5, dashOffset: 0, style: 'Butt', join: 'Miter', color: '#000000' },
  'Dotted': { type: 'Dotted', width: 2, dashArray: 2, dashOffset: 0, style: 'Round', join: 'Round', color: '#000000' },
}

export function BookplateDesigner() {
  const [imageType, setImageType] = useState('Animal')
  const [selectedImage, setSelectedImage] = useState('Bat')
  const [font, setFont] = useState('Times New Roman')
  const [fontSize, setFontSize] = useState(51)
  const [lines, setLines] = useState(5)
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [foregroundColor, setForegroundColor] = useState('#000000')
  const [showGrid, setShowGrid] = useState(false)
  const [bookplateWidth, setBookplateWidth] = useState(0)
  const [bookplateHeight, setBookplateHeight] = useState(0)
  const [name, setName] = useState('Iver Raknes Finne')
  const [savedImage, setSavedImage] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([
    {
      type: 'Solid',
      width: 2,
      dashArray: 0,
      dashOffset: 0,
      style: 'Butt',
      join: 'Miter',
      color: '#000000'
    }
  ])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setBookplateWidth(window.innerWidth / 2)
      setBookplateHeight(window.innerHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    drawBookplate()
  }, [imageType, selectedImage, font, fontSize, lines, backgroundColor, foregroundColor, showGrid, bookplateWidth, bookplateHeight, name, strokes])

  const drawBookplate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
  
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  
    canvas.width = bookplateWidth * 2
    canvas.height = bookplateHeight
  
    const drawSide = (startX: number, mirrored: boolean) => {
      ctx.save()
      if (mirrored) {
        ctx.translate(startX + bookplateWidth, canvas.height)
        ctx.rotate(Math.PI)
        ctx.scale(-1, 1)
      } else {
        ctx.translate(startX, 0)
      }
  
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, bookplateWidth, bookplateHeight)
  
      if (showGrid) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
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
  
      strokes.forEach((stroke) => {
        ctx.strokeStyle = stroke.color
        ctx.lineWidth = stroke.width
        ctx.lineCap = stroke.style.toLowerCase() as CanvasLineCap
        ctx.lineJoin = stroke.join.toLowerCase() as CanvasLineJoin
        ctx.setLineDash([stroke.dashArray, stroke.dashOffset])
        ctx.strokeRect(stroke.width / 2, stroke.width / 2, bookplateWidth - stroke.width, bookplateHeight - stroke.width)
      })
  
      // Draw lines
      ctx.strokeStyle = foregroundColor
      ctx.lineWidth = 1
      ctx.setLineDash([])
      const lineSpacing = bookplateHeight / (lines + 1)
      for (let i = 1; i <= lines; i++) {
        const y = i * lineSpacing
        ctx.beginPath()
        ctx.moveTo(bookplateWidth * 0.1, y)
        ctx.lineTo(bookplateWidth * 0.9, y)
        ctx.stroke()
      }
  
      const img = new Image()
      img.onload = () => {
        const availableWidth = bookplateWidth * 0.8
        const availableHeight = bookplateHeight * 0.4 // Reduced from 0.5 to move image up
  
        const scaleX = availableWidth / img.width
        const scaleY = availableHeight / img.height
        const scale = Math.min(scaleX, scaleY)
  
        const scaledWidth = Math.max(1, img.width * scale)
        const scaledHeight = Math.max(1, img.height * scale)
  
        const x = (bookplateWidth - scaledWidth) / 2
        const y = bookplateHeight * 0.05 // Moved up from 0.15
  
        // Create a temporary canvas to manipulate the image
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = scaledWidth
        tempCanvas.height = scaledHeight
        const tempCtx = tempCanvas.getContext('2d')
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight)
          
          // Apply foreground color
          tempCtx.globalCompositeOperation = 'source-in'
          tempCtx.fillStyle = foregroundColor
          tempCtx.fillRect(0, 0, scaledWidth, scaledHeight)
  
          // Draw the colored image onto the main canvas
          ctx.drawImage(tempCanvas, x, y)
        }
  
        ctx.fillStyle = foregroundColor
        ctx.font = `${fontSize}px ${font}`
        ctx.textAlign = 'center'
        ctx.fillText(name, bookplateWidth / 2, bookplateHeight * 0.6) // Moved up from 0.75
  
        updateBadgeTexture()
      }
      img.src = `/${imageType.toLowerCase()}s/${selectedImage.toLowerCase().replace(' ', '-')}.svg`
  
      ctx.restore()
    }
  
    drawSide(0, false)
    drawSide(bookplateWidth, true)
  }
  
  const updateBadgeTexture = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const image = canvas.toDataURL('image/png')
      setSavedImage(image)
    }
  }

  const addStroke = () => {
    setStrokes([...strokes, {
      type: 'Solid',
      width: 2,
      dashArray: 0,
      dashOffset: 0,
      style: 'Butt',
      join: 'Miter',
      color: '#000000'
    }])
  }

  const removeStroke = (index: number) => {
    setStrokes(strokes.filter((_, i) => i !== index))
  }

  const updateStroke = (index: number, key: keyof Stroke, value: string | number) => {
    const newStrokes = [...strokes]
    newStrokes[index] = { ...newStrokes[index], [key]: value }
    setStrokes(newStrokes)
  }

  const applyStrokePreset = (index: number, preset: string) => {
    const newStrokes = [...strokes]
    newStrokes[index] = { ...strokePresets[preset as keyof typeof strokePresets] }
    setStrokes(newStrokes)
  }

  const downloadBookplate = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'bookplate.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const ColorPicker = ({ color, onChange }: { color: string, onChange: (color: string) => void }) => (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[30px] h-[30px] p-0 rounded-full"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((preset) => (
              <Button
                key={preset}
                className="w-8 h-8 rounded-full p-0"
                style={{ backgroundColor: preset }}
                onClick={() => onChange(preset)}
              />
            ))}
          </div>
          <Input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
  return (
    <div className={`flex flex-col items-center justify-center w-screen h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full h-full flex flex-col md:flex-row">
        <Card className={`flex-1 overflow-auto ${darkMode ? 'bg-black text-white' : ''}`}>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bookplate Designer</h2>
              <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </div>
            <Tabs defaultValue="design">
              <TabsList className="w-full">
                <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
                <TabsTrigger value="strokes" className="flex-1">Strokes</TabsTrigger>
              </TabsList>
              <TabsContent value="design">
                <div className="space-y-4">
                  <div>
                    <Label>Image Type</Label>
                    <Select value={imageType} onValueChange={setImageType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Animal">Animal</SelectItem>
                        <SelectItem value="Stamp">Stamp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{imageType}</Label>
                    <Select value={selectedImage} onValueChange={setSelectedImage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(imageType === 'Animal' ? animals : stamps).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label>Font</Label>
                      <Select value={font} onValueChange={setFont}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fonts.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <Label>Font Size</Label>
                      <Input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <Label>Number of Lines</Label>
                    <Input type="number" value={lines} onChange={(e) => setLines(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Background Color</Label>
                    <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  </div>
                  <div>
                    <Label>Foreground Color</Label>
                    <ColorPicker color={foregroundColor} onChange={setForegroundColor} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                    <Label htmlFor="show-grid">Show Grid</Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="strokes">
                <div className="space-y-2">
                  <div>
                    <Label>Stroke Presets</Label>
                    <Select onValueChange={(preset) => applyStrokePreset(0, preset)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(strokePresets).map((preset) => (
                          <SelectItem key={preset} value={preset}>
                            {preset}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {strokes.map((stroke, index) => (
                    <Card key={index} className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold">Stroke {index + 1}</h3>
                        <Button variant="ghost" size="sm" onClick={() => removeStroke(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select value={stroke.type} onValueChange={(value) => updateStroke(index, 'type', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {strokeTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Width</Label>
                          <Input type="number" value={stroke.width} onChange={(e) => updateStroke(index, 'width', Number(e.target.value))} className="h-8" />
                        </div>
                        {stroke.type !== 'Solid' && (
                          <>
                            <div>
                              <Label className="text-xs">Dash Array</Label>
                              <Input type="number" value={stroke.dashArray} onChange={(e) => updateStroke(index, 'dashArray', Number(e.target.value))} className="h-8" />
                            </div>
                            <div>
                              <Label className="text-xs">Dash Offset</Label>
                              <Input type="number" value={stroke.dashOffset} onChange={(e) => updateStroke(index, 'dashOffset', Number(e.target.value))} className="h-8" />
                            </div>
                          </>
                        )}
                        <div>
                          <Label className="text-xs">Style</Label>
                          <Select value={stroke.style} onValueChange={(value) => updateStroke(index, 'style', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {strokeStyles.map((style) => (
                                <SelectItem key={style} value={style}>
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Join</Label>
                          <Select value={stroke.join} onValueChange={(value) => updateStroke(index, 'join', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {strokeJoins.map((join) => (
                                <SelectItem key={join} value={join}>
                                  {join}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Color</Label>
                          <ColorPicker color={stroke.color} onChange={(color) => updateStroke(index, 'color', color)} />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addStroke} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Stroke
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="flex-1 relative">
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center">
            {savedImage && (
              <ThreeDBadge
                imageUrl={savedImage}
                darkMode={darkMode}
              />
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
            <Button variant="outline" size="icon">
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={downloadBookplate}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}