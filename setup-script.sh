#!/bin/bash

# Couleurs pour une meilleure lisibilité
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Script de configuration et de lancement de NPC Social Sim ===${NC}\n"

# Fonction pour vérifier si une commande existe
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 n'est pas installé. Veuillez l'installer d'abord.${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 est installé${NC}"
        return 0
    fi
}

# Fonction pour vérifier si un dossier existe
check_directory() {
    if [ ! -d "$1" ]; then
        echo -e "${RED}❌ Le dossier $1 n'existe pas${NC}"
        return 1
    else
        echo -e "${GREEN}✓ Le dossier $1 existe${NC}"
        return 0
    fi
}

# Configure live reload settings
configure_live_reload() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)
    else
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi

    # Save current config
    cp capacitor.config.json capacitor.config.json.bak

    # Update config for live reload
    cat > capacitor.config.json << EOF
{
  "appId": "com.npcsocialsim.app",
  "appName": "npc-social-sim",
  "webDir": "dist",
  "server": {
    "url": "http://$LOCAL_IP:5173",
    "cleartext": true,
    "androidScheme": "http",
    "iosScheme": "http"
  },
  "ios": {
    "contentInset": "automatic",
    "backgroundColor": "#111827",
    "webView": {
      "allowsInlineMediaPlayback": true,
      "allowsAirPlayForMediaPlayback": true,
      "allowsBackForwardNavigationGestures": true,
      "allowsLinkPreview": true,
      "scrollEnabled": true,
      "allowUniversalAccessFromFileURLs": true,
      "limitsNavigationsToAppBoundDomains": true
    }
  },
  "android": {
    "backgroundColor": "#111827",
    "webView": {
      "allowFileAccess": true,
      "allowFileAccessFromFileURLs": true,
      "allowUniversalAccessFromFileURLs": true,
      "mixedContent": true
    }
  }
}
EOF
}

# Restore original config
restore_config() {
    if [ -f "capacitor.config.json.bak" ]; then
        mv capacitor.config.json.bak capacitor.config.json
        npx cap sync
    fi
}

# 1. Vérification des prérequis
echo -e "${YELLOW}1. Vérification des prérequis...${NC}"
check_command "node" || exit 1
check_command "npm" || exit 1
check_command "git" || exit 1

# 2. Installation des dépendances
echo -e "\n${YELLOW}2. Installation des dépendances du projet...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Dépendances Node.js installées${NC}"
else
    echo -e "${RED}❌ package.json non trouvé${NC}"
    exit 1
fi

# Menu principal
while true; do
    echo -e "\n${BLUE}=== Menu Principal ===${NC}"
    echo -e "${YELLOW}Choisissez une plateforme :${NC}"
    echo "1) Web (Development)"
    echo "2) Web (Production Preview)"
    echo "3) iOS avec Live Reload"
    echo "4) Android avec Live Reload"
    echo "5) Quitter"
    read -p "Votre choix (1-5): " platform_choice

    case $platform_choice in
        1)
            echo -e "\n${YELLOW}Lancement du serveur de développement...${NC}"
            npm run dev
            break
            ;;
        2)
            echo -e "\n${YELLOW}Construction du projet...${NC}"
            npm run build
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ Build réussi${NC}"
                npm run preview
            else
                echo -e "${RED}❌ Erreur lors du build${NC}"
            fi
            break
            ;;
        3)
            if [[ "$OSTYPE" != "darwin"* ]]; then
                echo -e "${RED}❌ Le développement iOS nécessite macOS${NC}"
                continue
            fi
            configure_live_reload
            echo -e "\n${YELLOW}Préparation pour iOS...${NC}"
            npm run build
            npx cap sync
            cd ios/App && pod install && cd ../..
            npx cap run ios --livereload --external
            restore_config
            break
            ;;
        4)
            configure_live_reload
            echo -e "\n${YELLOW}Préparation pour Android...${NC}"
            npm run build
            npx cap sync
            npx cap run android --livereload --external
            restore_config
            break
            ;;
        5)
            echo -e "${GREEN}Au revoir !${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Choix invalide. Veuillez choisir entre 1 et 5.${NC}"
            ;;
    esac
done