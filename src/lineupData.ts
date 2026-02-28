export interface LineupArtist {
  name: string
  description: string
  stage: "living" | "kitchen"
  time: string
}

export const lineupArtists: LineupArtist[] = [

  {
    name: 'MAD',
    description: 'Theatrical ukulele-rock',
    stage: "kitchen",
    time: "8:00"
  },
  {
    name: 'DJ Fitzulele',
    description: 'Spinning the finest ukulele beats',
    stage: "living",
    time: "8:15"
  },
  {
    name: "The Finding Forrester is a fantastic movie and everyone should watch it again soon Band",
    description: '... with ukuleles',
    stage: "kitchen",
    time: "8:30"
  },
    {
    name: 'Rose Asteroid',
    description: 'Ukuleles and stuff, who knows',
    stage: "living",
    time: "8:45"
  },
  {
    name: 'Paper Castles',
    description: 'Dreamy',
    stage: "kitchen",
    time: "9:00"
  },
  {
    name: 'Rangus',
    description: 'Now with ukuleles',
    stage: "living",
    time: "9:15"
  },
    {
    name: 'Evan and Josh',
    description: 'Creatively named ukulele duo',
    stage: "kitchen",
    time: "9:30"
  },
    {
    name: 'Plastic Ukulele Band',
    description: 'Back again. Still plastic.',
    stage: "living",
    time: "9:45"
  },

]
