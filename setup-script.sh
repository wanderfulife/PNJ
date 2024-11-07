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

# Fonction pour le développement web
run_web_dev() {
    echo -e "\n${YELLOW}Lancement en mode web développement...${NC}"
    npm run dev
}

# Fonction pour la prévisualisation web (build)
run_web_preview() {
    echo -e "\n${YELLOW}Lancement en mode web production...${NC}"
    npm run preview
}

# 1. Vérification des prérequis
echo -e "${YELLOW}1. Vérification des prérequis...${NC}"
check_command "node" || exit 1
check_command "npm" || exit 1
check_command "git" || exit 1

# Vérification des outils de développement mobile selon la plateforme choisie
check_mobile_requirements() {
    if [ "$1" == "ios" ]; then
        echo -e "\n${YELLOW}Vérification des outils iOS...${NC}"
        if [[ "$OSTYPE" != "darwin"* ]]; then
            echo -e "${RED}❌ Le développement iOS nécessite macOS${NC}"
            return 1
        fi
        check_command "pod" || echo -e "${RED}⚠️ CocoaPods n'est pas installé. Pour iOS, installez-le avec: sudo gem install cocoapods${NC}"
        check_command "xcodebuild" || echo -e "${RED}⚠️ Xcode n'est pas installé. Installez-le depuis l'App Store${NC}"
    elif [ "$1" == "android" ]; then
        echo -e "\n${YELLOW}Vérification des outils Android...${NC}"
        if [[ -z "${ANDROID_SDK_ROOT}" ]]; then
            echo -e "${RED}⚠️ ANDROID_SDK_ROOT n'est pas défini${NC}"
        else
            echo -e "${GREEN}✓ ANDROID_SDK_ROOT est défini: $ANDROID_SDK_ROOT${NC}"
        fi
    fi
}

# 2. Installation des dépendances
echo -e "\n${YELLOW}2. Installation des dépendances du projet...${NC}"
if [ -f "package.json" ]; then
    npm install
    echo -e "${GREEN}✓ Dépendances Node.js installées${NC}"
else
    echo -e "${RED}❌ package.json non trouvé${NC}"
    exit 1
fi

# 3. Menu principal
while true; do
    echo -e "\n${BLUE}=== Menu Principal ===${NC}"
    echo -e "${YELLOW}Choisissez une plateforme :${NC}"
    echo "1) Web (Development)"
    echo "2) Web (Production Preview)"
    echo "3) iOS"
    echo "4) Android"
    echo "5) Quitter"
    read -p "Votre choix (1-5): " platform_choice

    case $platform_choice in
        1)
            run_web_dev
            break
            ;;
        2)
            # Build puis preview
            echo -e "\n${YELLOW}Construction du projet...${NC}"
            npm run build
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ Build réussi${NC}"
                run_web_preview
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
            check_mobile_requirements "ios"
            echo -e "\n${YELLOW}Préparation pour iOS...${NC}"
            npm run build
            npx cap sync
            cd ios/App && pod install && cd ../..
            echo -e "\n${YELLOW}Choisissez une option de lancement :${NC}"
            echo "1) Ouvrir dans Xcode"
            echo "2) Lancer directement (nécessite un appareil connecté)"
            read -p "Votre choix (1/2): " ios_choice
            case $ios_choice in
                1)
                    npx cap open ios
                    ;;
                2)
                    npx cap run ios
                    ;;
                *)
                    echo -e "${RED}Choix invalide${NC}"
                    ;;
            esac
            break
            ;;
        4)
            check_mobile_requirements "android"
            echo -e "\n${YELLOW}Préparation pour Android...${NC}"
            npm run build
            npx cap sync
            echo -e "\n${YELLOW}Choisissez une option de lancement :${NC}"
            echo "1) Ouvrir dans Android Studio"
            echo "2) Lancer directement (nécessite un appareil connecté)"
            read -p "Votre choix (1/2): " android_choice
            case $android_choice in
                1)
                    npx cap open android
                    ;;
                2)
                    npx cap run android
                    ;;
                *)
                    echo -e "${RED}Choix invalide${NC}"
                    ;;
            esac
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

echo -e "\n${BLUE}=== Notes importantes ===${NC}"
case $platform_choice in
    1|2)
        echo "- Mode web : Utilisez Ctrl+C pour arrêter le serveur"
        echo "- L'application est accessible via votre navigateur"
        ;;
    3)
        echo "- iOS : Si vous avez choisi Xcode, cliquez sur le bouton play pour lancer l'app"
        echo "- Assurez-vous d'avoir configuré un compte développeur dans Xcode"
        ;;
    4)
        echo "- Android : Si vous avez choisi Android Studio, attendez la fin de l'indexation"
        echo "- Vérifiez que votre appareil ou émulateur est bien détecté"
        ;;
esac
