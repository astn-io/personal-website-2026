const ADJECTIVES = [
  'Adventurous', 'Blazing', 'Calm', 'Daring', 'Eager',
  'Fierce', 'Gentle', 'Happy', 'Icy', 'Jolly',
  'Kind', 'Lively', 'Mighty', 'Noble', 'Optimistic',
  'Playful', 'Quick', 'Radiant', 'Serene', 'Tidy',
  'Upbeat', 'Vibrant', 'Whimsical', 'Xenial', 'Zealous',
  'Bold', 'Cheerful', 'Dazzling', 'Earnest', 'Fluffy',
  'Graceful', 'Humble', 'Inventive', 'Jovial', 'Keen',
]

const NOUNS = [
  'Badger', 'Capybara', 'Dolphin', 'Elephant', 'Falcon',
  'Gecko', 'Hedgehog', 'Iguana', 'Jaguar', 'Koala',
  'Lemur', 'Mongoose', 'Narwhal', 'Otter', 'Penguin',
  'Quokka', 'Raccoon', 'Salamander', 'Tapir', 'Viper',
  'Wombat', 'Axolotl', 'Bison', 'Capuchin', 'Dingo',
  'Echidna', 'Ferret', 'Gibbon', 'Hyena', 'Ibis',
]

function generateName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}

const NAME_KEY = 'comment_author_name'
const VOTER_ID_KEY = 'comment_voter_id'
const VOTES_KEY = 'comment_votes'

export function getStoredName(): string {
  let name = localStorage.getItem(NAME_KEY)
  if (!name) {
    name = generateName()
    localStorage.setItem(NAME_KEY, name)
  }
  return name
}

export function setStoredName(name: string): void {
  localStorage.setItem(NAME_KEY, name)
}

export function getVoterId(): string {
  let id = localStorage.getItem(VOTER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(VOTER_ID_KEY, id)
  }
  return id
}

export function getStoredVotes(): Record<string, 'up' | 'down'> {
  try {
    const raw = localStorage.getItem(VOTES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setStoredVote(commentId: string, type: 'up' | 'down' | null): void {
  const votes = getStoredVotes()
  if (type === null) {
    delete votes[commentId]
  } else {
    votes[commentId] = type
  }
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes))
}
