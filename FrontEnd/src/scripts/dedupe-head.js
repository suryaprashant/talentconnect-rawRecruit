// scripts/dedupe-head.js
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function dedupeHtmlHead(filePath) {
  let html = readFileSync(filePath, 'utf-8')

  // Parse out the <head> block
  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/)
  if (!headMatch) return

  const headContent = headMatch[1]
  const lines = headContent.split('\n')
  
  const seen = new Set()
  const deduped = lines.filter(line => {
    const trimmed = line.trim()
    if (!trimmed) return true // keep blank lines
    
    // Extract the tag signature (tag name + key attributes)
    const tagMatch = trimmed.match(/<(title|meta|link)[^>]*>/i)
    if (!tagMatch) return true
    
    // For meta tags, use name/property + content as key
    // For title, just use the tag itself
    // For link rel=canonical, use rel as key
    let key = trimmed
      .replace(/\s+/g, ' ')
      .replace(/ \/>/g, '>')
      .toLowerCase()

    if (seen.has(key)) {
      console.log(`Removed duplicate: ${trimmed.substring(0, 80)}`)
      return false
    }
    seen.add(key)
    return true
  })

  const newHead = deduped.join('\n')
  html = html.replace(headMatch[1], newHead)
  writeFileSync(filePath, html, 'utf-8')
}

function walkDir(dir) {
  const files = readdirSync(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    if (statSync(fullPath).isDirectory()) {
      walkDir(fullPath)
    } else if (file.endsWith('.html')) {
      console.log(`Processing: ${fullPath}`)
      dedupeHtmlHead(fullPath)
    }
  }
}

walkDir('./dist')
console.log('Done deduplicating head tags.')