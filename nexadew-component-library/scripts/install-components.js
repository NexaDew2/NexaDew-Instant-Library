#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * NexaDew Component Installer
 * Automatically installs and registers components from package.json
 */

class ComponentInstaller {
  constructor() {
    this.packagePath = path.join(process.cwd(), 'package.json');
    this.componentsDir = path.join(process.cwd(), 'src', 'components');
    this.registryPath = path.join(process.cwd(), 'src', 'utils', 'component-registry.json');
  }

  async install() {
    try {
      console.log('🚀 Installing NexaDew Components...\n');

      // Read package.json
      const packageJson = this.readPackageJson();
      
      // Get component definitions
      const components = packageJson.nexadew?.components || {};
      
      if (Object.keys(components).length === 0) {
        console.log('⚠️  No components found in package.json nexadew.components');
        return;
      }

      // Ensure components directory exists
      this.ensureDirectory(this.componentsDir);

      // Install each component
      const installedComponents = [];
      for (const [name, componentPath] of Object.entries(components)) {
        const result = await this.installComponent(name, componentPath);
        if (result) {
          installedComponents.push(result);
        }
      }

      // Generate component registry
      this.generateRegistry(installedComponents);

      console.log(`\n✅ Successfully installed ${installedComponents.length} components!`);
      console.log('\n📋 Installed Components:');
      installedComponents.forEach(comp => {
        console.log(`   • ${comp.name} (${comp.type})`);
      });

      console.log('\n🎉 Components are ready to use in your NexaDew designer!');

    } catch (error) {
      console.error('❌ Installation failed:', error.message);
      process.exit(1);
    }
  }

  readPackageJson() {
    if (!fs.existsSync(this.packagePath)) {
      throw new Error('package.json not found');
    }

    const content = fs.readFileSync(this.packagePath, 'utf8');
    return JSON.parse(content);
  }

  ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async installComponent(name, componentPath) {
    try {
      const fullPath = path.join(process.cwd(), componentPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Component file not found: ${componentPath}`);
        return null;
      }

      // Read component file to extract metadata
      const componentContent = fs.readFileSync(fullPath, 'utf8');
      const metadata = this.extractComponentMetadata(name, componentContent);

      console.log(`✓ Registered ${name} component`);

      return {
        name,
        type: name.toLowerCase(),
        path: componentPath,
        category: metadata.category,
        props: metadata.props,
        description: metadata.description
      };

    } catch (error) {
      console.log(`❌ Failed to install ${name}: ${error.message}`);
      return null;
    }
  }

  extractComponentMetadata(name, content) {
    // Extract default props from component
    const defaultProps = {};
    const propsRegex = /(\w+)\s*=\s*["']([^"']+)["']/g;
    let match;

    while ((match = propsRegex.exec(content)) !== null) {
      defaultProps[match[1]] = match[2];
    }

    // Determine category based on component name
    const category = this.determineCategory(name);

    return {
      category,
      props: defaultProps,
      description: `${name} component for NexaDew designer`
    };
  }

  determineCategory(name) {
    const categoryMap = {
      'Navbar': 'navigation',
      'Header': 'navigation',
      'Footer': 'navigation',
      'Hero': 'layout',
      'Card': 'layout',
      'Container': 'layout',
      'Grid': 'layout',
      'Section': 'layout',
      'Button': 'form',
      'Input': 'form',
      'Form': 'form',
      'Select': 'form',
      'Textarea': 'form',
      'Text': 'content',
      'Image': 'content',
      'Icon': 'content',
      'Logo': 'content'
    };

    return categoryMap[name] || 'custom';
  }

  generateRegistry(components) {
    const registry = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      components: components.reduce((acc, comp) => {
        acc[comp.type] = {
          name: comp.name,
          category: comp.category,
          componentPath: comp.path,
          defaultProps: comp.props,
          description: comp.description
        };
        return acc;
      }, {})
    };

    // Ensure utils directory exists
    const utilsDir = path.dirname(this.registryPath);
    this.ensureDirectory(utilsDir);

    fs.writeFileSync(this.registryPath, JSON.stringify(registry, null, 2));
    console.log('📝 Generated component registry');
  }
}

// Run installer
if (require.main === module) {
  const installer = new ComponentInstaller();
  installer.install();
}

module.exports = ComponentInstaller;
