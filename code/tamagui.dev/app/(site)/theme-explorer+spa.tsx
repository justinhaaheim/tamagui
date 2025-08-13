import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Copy } from '@tamagui/lucide-icons'
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  View,
  Separator,
  H1,
  H2,
  Paragraph,
  Input,
  Select,
  Adapt,
  Sheet,
} from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { getTokens, useTheme, getConfig } from '@tamagui/core'
import { defaultConfig } from '@tamagui/config/v4'
import { Container } from '~/components/Containers'

// Helper to check if value is an object
const isObject = (val: any): val is object => 
  val !== null && typeof val === 'object' && !Array.isArray(val)

// Helper to format values for display
const formatValue = (value: any): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return '[Function]'
  if (Array.isArray(value)) return `[Array(${value.length})]`
  if (isObject(value)) return '[Object]'
  return String(value)
}

// Color swatch component
function ColorSwatch({ color }: { color: string }) {
  if (!color || typeof color !== 'string' || color.startsWith('[')) {
    return null
  }
  
  return (
    <View
      width={20}
      height={20}
      borderRadius="$2"
      backgroundColor={color}
      borderWidth={1}
      borderColor="$borderColor"
    />
  )
}

// Copy button component
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <Button
      size="$2"
      icon={Copy}
      circular
      onPress={handleCopy}
      opacity={copied ? 0.5 : 1}
    >
      {copied && <Text fontSize="$1">Copied!</Text>}
    </Button>
  )
}

// Tree node component
function TreeNode({ 
  name, 
  value, 
  depth = 0,
  path = '',
  searchTerm = ''
}: { 
  name: string
  value: any
  depth?: number
  path?: string
  searchTerm?: string
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const isExpandable = isObject(value) && Object.keys(value).length > 0
  const currentPath = path ? `${path}.${name}` : name
  
  // Check if this node or its children match the search
  const matchesSearch = useMemo(() => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    
    // Check current node
    if (name.toLowerCase().includes(term)) return true
    if (String(value).toLowerCase().includes(term)) return true
    
    // Check children
    if (isObject(value)) {
      return Object.entries(value).some(([k, v]) => 
        k.toLowerCase().includes(term) || 
        String(v).toLowerCase().includes(term)
      )
    }
    
    return false
  }, [name, value, searchTerm])
  
  if (!matchesSearch) return null
  
  const formattedValue = formatValue(value)
  const isColor = typeof value === 'string' && 
    (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))
  
  return (
    <YStack>
      <XStack
        paddingLeft={depth * 20}
        paddingVertical="$1"
        alignItems="center"
        gap="$2"
        hoverStyle={{ backgroundColor: '$backgroundHover' }}
        cursor={isExpandable ? 'pointer' : 'default'}
        onPress={isExpandable ? () => setExpanded(!expanded) : undefined}
      >
        {isExpandable && (
          <View width={20}>
            {expanded ? (
              <ChevronDown size={16} color="$color10" />
            ) : (
              <ChevronRight size={16} color="$color10" />
            )}
          </View>
        )}
        
        {!isExpandable && <View width={20} />}
        
        <Text
          fontSize="$3"
          fontWeight={isExpandable ? '600' : '400'}
          color={isExpandable ? '$color12' : '$color11'}
          fontFamily="$mono"
        >
          {name}
        </Text>
        
        {!isExpandable && (
          <>
            <Text fontSize="$2" color="$color10">:</Text>
            
            {isColor && <ColorSwatch color={value} />}
            
            <Text 
              fontSize="$3" 
              color="$color11"
              fontFamily="$mono"
              maxWidth={400}
              numberOfLines={1}
            >
              {formattedValue}
            </Text>
            
            <CopyButton value={formattedValue} />
          </>
        )}
      </XStack>
      
      {isExpandable && expanded && (
        <YStack>
          {Object.entries(value)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, val]) => (
              <TreeNode
                key={key}
                name={key}
                value={val}
                depth={depth + 1}
                path={currentPath}
                searchTerm={searchTerm}
              />
            ))}
        </YStack>
      )}
    </YStack>
  )
}

// Theme selector component
function ThemeSelector({ 
  value, 
  onValueChange 
}: { 
  value: string
  onValueChange: (value: string) => void
}) {
  const config = getConfig()
  const themeNames = Object.keys(config.themes || {})
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <Select.Trigger width={200}>
        <Select.Value placeholder="Select theme" />
      </Select.Trigger>
      
      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>
      
      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Group>
            <Select.Label>Themes</Select.Label>
            {themeNames.map((name) => (
              <Select.Item key={name} value={name} index={themeNames.indexOf(name)}>
                <Select.ItemText>{name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  )
}

export default function ThemeExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('light')
  const [dataSource, setDataSource] = useState<'runtime' | 'default'>('runtime')
  
  const config = getConfig()
  const tokens = getTokens()
  const currentTheme = useTheme()
  
  // Get the theme data based on selection
  const themeData = useMemo(() => {
    if (dataSource === 'default') {
      // Show the default config from @tamagui/config
      return {
        themes: defaultConfig.themes,
        tokens: defaultConfig.tokens,
        fonts: defaultConfig.fonts,
        media: defaultConfig.media,
        shorthands: defaultConfig.shorthands,
        animations: defaultConfig.animations,
        settings: defaultConfig.settings,
      }
    } else {
      // Show the runtime config
      const selectedThemeData = config.themes?.[selectedTheme] || {}
      return {
        currentTheme: selectedThemeData,
        allThemes: config.themes,
        tokens: tokens,
        fonts: config.fonts,
        media: config.media,
        shorthands: config.shorthands,
        animations: config.animations,
        settings: config.settings,
      }
    }
  }, [dataSource, selectedTheme, config, tokens, currentTheme])
  
  return (
    <>
      <HeadInfo
        title="Theme Explorer | Tamagui"
        description="Explore and understand Tamagui's theme structure"
      />
      
      <Container>
        <YStack flex={1} space="$4" paddingVertical="$6">
          <YStack space="$2">
            <H1>Theme Explorer</H1>
            <Paragraph size="$5" color="$color11">
              Explore Tamagui's theme structure and understand how themes are composed.
              Similar to MUI's default theme viewer, this tool lets you browse through
              all theme values, tokens, and configuration.
            </Paragraph>
          </YStack>
          
          <XStack gap="$4" flexWrap="wrap" alignItems="center">
            <XStack gap="$2" alignItems="center">
              <Text>Data Source:</Text>
              <XStack gap="$2">
                <Button
                  size="$3"
                  theme={dataSource === 'runtime' ? 'active' : undefined}
                  onPress={() => setDataSource('runtime')}
                >
                  Runtime Config
                </Button>
                <Button
                  size="$3"
                  theme={dataSource === 'default' ? 'active' : undefined}
                  onPress={() => setDataSource('default')}
                >
                  Default Config (v4)
                </Button>
              </XStack>
            </XStack>
            
            {dataSource === 'runtime' && (
              <XStack gap="$2" alignItems="center">
                <Text>Theme:</Text>
                <ThemeSelector value={selectedTheme} onValueChange={setSelectedTheme} />
              </XStack>
            )}
            
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              width={200}
            />
          </XStack>
          
          <Separator />
          
          <ScrollView flex={1} maxHeight="70vh">
            <YStack space="$6" paddingBottom="$8">
              {Object.entries(themeData).map(([section, data]) => (
                <YStack key={section} space="$2">
                  <H2 size="$6" color="$color12">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </H2>
                  <YStack
                    backgroundColor="$background"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor="$borderColor"
                    padding="$2"
                  >
                    {isObject(data) ? (
                      Object.entries(data)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([key, value]) => (
                          <TreeNode
                            key={key}
                            name={key}
                            value={value}
                            searchTerm={searchTerm}
                          />
                        ))
                    ) : (
                      <Text color="$color10" padding="$2">
                        {formatValue(data)}
                      </Text>
                    )}
                  </YStack>
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        </YStack>
      </Container>
    </>
  )
}