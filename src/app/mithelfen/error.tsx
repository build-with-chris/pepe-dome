'use client'

// Dieselbe Fehleransicht wie auf den oeffentlichen Seiten. Sie muss innerhalb
// eines Layouts mit <html> liegen, deshalb je Bereich eine Datei statt einer
// gemeinsamen unter src/app. Was oberhalb davon bricht, faengt global-error.tsx.
export { default } from '@/app/[lang]/error'
