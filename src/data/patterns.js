export const patterns = [
  {
    category: 'Contatti',
    items: [
      {
        name: 'Email',
        pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}',
        flags: 'gi',
        description: 'Cattura indirizzi email standard (nome@dominio.tld)',
        testText: 'Scrivi a mario.rossi@example.com oppure a info@azienda.co.uk per assistenza.',
      },
      {
        name: 'Telefono italiano',
        pattern: '(?:\\+39\\s?)?3\\d{2}[\\s.-]?\\d{3}[\\s.-]?\\d{4}',
        flags: 'g',
        description: 'Numeri di cellulare italiani, con prefisso +39 opzionale',
        testText: 'Chiama il 347 123 4567 o il +39 333-987-6543 per info.',
      },
      {
        name: 'URL',
        pattern: 'https?:\\/\\/(?:www\\.)?[a-zA-Z0-9][\\w.-]+[a-zA-Z0-9]\\.[a-zA-Z]{2,}(?:\\/[^\\s]*)?',
        flags: 'gi',
        description: 'URL http/https con dominio e percorso opzionale',
        testText: 'Visita https://www.example.com/path?query=1 oppure http://sito.it.',
      },
    ],
  },
  {
    category: 'Numeri e date',
    items: [
      {
        name: 'Data IT (gg/mm/aaaa)',
        pattern: '\\b(0?[1-9]|[12]\\d|3[01])\\/(0?[1-9]|1[0-2])\\/(\\d{4})\\b',
        flags: 'g',
        description: 'Date in formato italiano giorno/mese/anno',
        testText: 'Scadenza il 15/03/2025, inizio il 01/01/2024 e fine il 31/12/2025.',
      },
      {
        name: 'Data ISO (aaaa-mm-gg)',
        pattern: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b',
        flags: 'g',
        description: 'Date in formato ISO 8601',
        testText: 'Evento dal 2025-06-15 al 2025-07-20 con pausa il 2025-06-22.',
      },
      {
        name: 'Codice Fiscale',
        pattern: '\\b[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]\\b',
        flags: 'gi',
        description: 'Codice fiscale italiano (16 caratteri)',
        testText: 'CF: RSSMRA85M10H501Z e BNCMRC90A01F205X sono validi.',
      },
      {
        name: 'Partita IVA',
        pattern: '\\b\\d{11}\\b',
        flags: 'g',
        description: 'Partita IVA italiana (11 cifre)',
        testText: 'P.IVA 12345678901 della ditta, e 98765432109 del fornitore.',
      },
      {
        name: 'Numero decimale',
        pattern: '\\b\\d+[.,]\\d+\\b',
        flags: 'g',
        description: 'Numeri con virgola o punto decimale',
        testText: 'Prezzi: 19,99 € e 45.50 € più 100 € tondo. Sconto del 12,5%.',
      },
    ],
  },
  {
    category: 'Testo e codice',
    items: [
      {
        name: 'Tag HTML',
        pattern: '<\\/?([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>',
        flags: 'gi',
        description: 'Tag HTML di apertura e chiusura',
        testText: '<div class="box"><p>Ciao <strong>mondo</strong></p></div>',
      },
      {
        name: 'Parole duplicate',
        pattern: '\\b(\\w+)\\s+\\1\\b',
        flags: 'gi',
        description: 'Trova parole ripetute consecutivamente',
        testText: 'Questo è un un testo con con alcune parole parole duplicate qua.',
      },
      {
        name: 'Commenti JS/TS',
        pattern: '(?:\\/\\/.*$|\\/\\*[\\s\\S]*?\\*\\/)',
        flags: 'gm',
        description: 'Commenti single-line // e multi-line /* */',
        testText: '// Questo è un commento\nconst x = 1; /* commento\nmulti-linea */ const y = 2;',
      },
      {
        name: 'Stringhe tra virgolette',
        pattern: '"([^"\\\\]|\\\\.)*"|\'([^\'\\\\]|\\\\.)*\'',
        flags: 'g',
        description: 'Stringhe tra virgolette doppie o singole',
        testText: `"ciao mondo" e 'l\\'altra stringa' insieme a "test" finale.`,
      },
      {
        name: 'IBAN italiano',
        pattern: '\\bIT\\d{2}[A-Z]\\d{10}[\\dA-Z]{12}\\b',
        flags: 'g',
        description: 'IBAN italiano (27 caratteri, inizia con IT)',
        testText: 'Bonifico su IT60X0542811101000000123456 e IT12A1234512345123456789012.',
      },
    ],
  },
];

export const allPatterns = patterns.flatMap((cat) => cat.items);
