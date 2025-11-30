#!/bin/bash

# Version Bump Script for Expo/React Native with Native iOS
# Updates version numbers across all config files consistently
# Note: Uses macOS/BSD sed syntax (-i '' flag)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# File paths
APP_JSON="app.json"
INFO_PLIST="ios/MillennialsPrimeAPP/Info.plist"
PROJECT_PBXPROJ="ios/MillennialsPrimeAPP.xcodeproj/project.pbxproj"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}                    Version Bump Script                              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "$APP_JSON" ]; then
    echo -e "${RED}Error: app.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Read current versions
CURRENT_VERSION=$(grep '"version"' "$APP_JSON" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
CURRENT_BUILD_APP_JSON=$(grep '"buildNumber"' "$APP_JSON" | sed 's/.*: *"\([^"]*\)".*/\1/')
CURRENT_BUILD_INFO_PLIST=$(grep -A1 "CFBundleVersion" "$INFO_PLIST" | grep "<string>" | sed 's/.*<string>\([^<]*\)<\/string>.*/\1/')
CURRENT_BUILD_PBXPROJ=$(grep "CURRENT_PROJECT_VERSION" "$PROJECT_PBXPROJ" | head -1 | sed 's/.*= *\([0-9]*\).*/\1/')

echo -e "${YELLOW}Current Versions:${NC}"
echo -e "  App Version:        ${GREEN}$CURRENT_VERSION${NC}"
echo -e "  Build (app.json):   ${GREEN}$CURRENT_BUILD_APP_JSON${NC}"
echo -e "  Build (Info.plist): ${GREEN}$CURRENT_BUILD_INFO_PLIST${NC}"
echo -e "  Build (pbxproj):    ${GREEN}$CURRENT_BUILD_PBXPROJ${NC}"
echo ""

# Check for version mismatches
if [ "$CURRENT_BUILD_APP_JSON" != "$CURRENT_BUILD_INFO_PLIST" ] || [ "$CURRENT_BUILD_APP_JSON" != "$CURRENT_BUILD_PBXPROJ" ]; then
    echo -e "${RED}⚠️  Warning: Build numbers are out of sync!${NC}"
    echo ""
fi

# Calculate suggested versions
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
if [ ${#VERSION_PARTS[@]} -ne 3 ]; then
    echo -e "${RED}Error: Version format must be MAJOR.MINOR.PATCH (found: $CURRENT_VERSION)${NC}"
    exit 1
fi
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

SUGGESTED_PATCH="$MAJOR.$MINOR.$((PATCH + 1))"
SUGGESTED_MINOR="$MAJOR.$((MINOR + 1)).0"
SUGGESTED_MAJOR="$((MAJOR + 1)).0.0"
SUGGESTED_BUILD=$((CURRENT_BUILD_APP_JSON + 1))

echo -e "${YELLOW}What would you like to bump?${NC}"
echo ""
echo -e "  ${BLUE}1)${NC} Build only     → Build $SUGGESTED_BUILD (Version stays $CURRENT_VERSION)"
echo -e "  ${BLUE}2)${NC} Patch version  → Version $SUGGESTED_PATCH, Build $SUGGESTED_BUILD"
echo -e "  ${BLUE}3)${NC} Minor version  → Version $SUGGESTED_MINOR, Build $SUGGESTED_BUILD"
echo -e "  ${BLUE}4)${NC} Major version  → Version $SUGGESTED_MAJOR, Build $SUGGESTED_BUILD"
echo -e "  ${BLUE}5)${NC} Custom         → Enter your own values"
echo -e "  ${BLUE}q)${NC} Quit"
echo ""

read -p "Select option [1-5, q]: " CHOICE

case $CHOICE in
    1)
        NEW_VERSION="$CURRENT_VERSION"
        NEW_BUILD="$SUGGESTED_BUILD"
        ;;
    2)
        NEW_VERSION="$SUGGESTED_PATCH"
        NEW_BUILD="$SUGGESTED_BUILD"
        ;;
    3)
        NEW_VERSION="$SUGGESTED_MINOR"
        NEW_BUILD="$SUGGESTED_BUILD"
        ;;
    4)
        NEW_VERSION="$SUGGESTED_MAJOR"
        NEW_BUILD="$SUGGESTED_BUILD"
        ;;
    5)
        read -p "Enter new version (current: $CURRENT_VERSION): " NEW_VERSION
        read -p "Enter new build number (current: $CURRENT_BUILD_APP_JSON): " NEW_BUILD
        if [ -z "$NEW_VERSION" ]; then NEW_VERSION="$CURRENT_VERSION"; fi
        if [ -z "$NEW_BUILD" ]; then NEW_BUILD="$SUGGESTED_BUILD"; fi
        ;;
    q|Q)
        echo -e "${YELLOW}Cancelled.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Summary of changes:${NC}"
echo -e "  Version:      ${RED}$CURRENT_VERSION${NC} → ${GREEN}$NEW_VERSION${NC}"
echo -e "  Build Number: ${RED}$CURRENT_BUILD_APP_JSON${NC} → ${GREEN}$NEW_BUILD${NC}"
echo ""
echo -e "Files to update:"
echo -e "  • $APP_JSON"
echo -e "  • $INFO_PLIST"
echo -e "  • $PROJECT_PBXPROJ"
echo ""

read -p "Proceed with update? [y/N]: " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Updating files...${NC}"

# Update app.json - version
sed -i '' "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" "$APP_JSON"
echo -e "  ✓ Updated version in app.json"

# Update app.json - buildNumber
sed -i '' "s/\"buildNumber\": \"$CURRENT_BUILD_APP_JSON\"/\"buildNumber\": \"$NEW_BUILD\"/" "$APP_JSON"
echo -e "  ✓ Updated buildNumber in app.json"

# Update Info.plist - CFBundleShortVersionString
perl -i -0pe "s/(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]*(<\/string>)/\${1}$NEW_VERSION\${2}/s" "$INFO_PLIST"
echo -e "  ✓ Updated CFBundleShortVersionString in Info.plist"

# Update Info.plist - CFBundleVersion
perl -i -0pe "s/(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/\${1}$NEW_BUILD\${2}/s" "$INFO_PLIST"
echo -e "  ✓ Updated CFBundleVersion in Info.plist"

# Update project.pbxproj - CURRENT_PROJECT_VERSION
sed -i '' "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" "$PROJECT_PBXPROJ"
echo -e "  ✓ Updated CURRENT_PROJECT_VERSION in project.pbxproj"

# Update project.pbxproj - MARKETING_VERSION
sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $NEW_VERSION;/g" "$PROJECT_PBXPROJ"
echo -e "  ✓ Updated MARKETING_VERSION in project.pbxproj"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Version bump complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  New Version: ${GREEN}$NEW_VERSION${NC}"
echo -e "  New Build:   ${GREEN}$NEW_BUILD${NC}"
echo ""

# Ask to commit
read -p "Commit these changes? [y/N]: " COMMIT_CONFIRM

if [[ "$COMMIT_CONFIRM" =~ ^[Yy]$ ]]; then
    git add "$APP_JSON" "$INFO_PLIST" "$PROJECT_PBXPROJ"
    git commit -m "chore: bump version to $NEW_VERSION (build $NEW_BUILD)"
    echo -e "${GREEN}✓ Changes committed${NC}"

    read -p "Push to remote? [y/N]: " PUSH_CONFIRM
    if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
        git push
        echo -e "${GREEN}✓ Pushed to remote${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  Build for TestFlight:  ${YELLOW}npm run build:prod${NC}"
echo -e "  Submit to App Store:   ${YELLOW}npm run submit:ios${NC}"
echo -e "  Test on simulator:     ${YELLOW}npm run build:simulator${NC} then ${YELLOW}npm run run:simulator${NC}"
echo ""
