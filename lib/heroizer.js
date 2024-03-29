
module.exports.heroize = () => {
  const randomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  const prefixes = ['Buzz ',
    'Rock ',
    'Amazing ',
    'Bombastic ',
    'Chivalrous ',
    'Daring ',
    'Extraordinary ',
    'Fantastic ',
    'Gritty ',
    'Helpful ',
    'Incredible ',
    'Jaunty ',
    'Killer ',
    'Lowly ',
    'Quixotic ',
    'Savage ',
    'Unlikely ',
    'Vicious ',
    'Wild ',
    'Terrifying ',
    'Unlikely ',
    'Marvelous ',
    'Nefarious ',
    'Odious ',
    'Poisonous ',
    'Radioactive ',
    'Smarty ',
    'Mask ',
    'Powerhouse ',
    'Buzz ',
    'Smarty ',
    'Mask ',
    'Tough ',
    'Incredible ',
    'Firey ',
    'Toxic ',
    'Wind ',
    'Walker ',
    'Captain ',
    'Capetape ',
    'Major ',
    'Math ',
    'Super ',
    'Glitter ',
    'Crimson ',
    'Moon ',
    'Chaser ',
    'The Electric ',
    'Speeding ',
    'Magenta ',
    'Comet ',
    'Obsidian ',
    'Pink ',
    'Green ',
    'Sparkle ',
    'Jade ',
    'Jester ',
    'Thunder ',
    'Rapid ',
    'Duke ',
    'Whistle ',
    'Shadow ',
    'Wing ',
    'Arrow ',
    'Sapphire ',
    'Astro ',
    'Captain ',
    'The Glittering ',
    'The Outer Space ',
    'The Extraterrestrial ',
    'The Swift ',
    'Magic ']
  const affixes = [
    'Flash ',
    'Imp',
    'Jaguar',
    'Lizard',
    'Nymph',
    'Ogre',
    'Python',
    'Queen',
    'Robot',
    'Spirit',
    'Thief',
    'Underdog',
    'Vampire',
    'Wizard',
    'Witch',
    'Alien ',
    'Beast',
    'Dragon',
    'Eagle',
    'Fairy',
    'Giant',
    'Hawk',
    'Wonder',
    'Atom',
    'Powerhouse ',
    'Protector ',
    'Pants',
    'Destroyer',
    'Crusher',
    'Defender',
    'Kid',
    'Wizard',
    'Falcon',
    'Phoenix',
    'Hurricane',
    'Hunter ',
    'Sleuth ',
    'Kitten',
    'Fluffball',
    'Dragon',
    'Pony',
    'Gazius ',
    'Magmamingo ',
    'Chimitar ',
    'Oysterminate ',
    'Discorpion ',
    'Unicorn',
    'Feather',
    'Lightning',
    'Thunder']

  return (prefixes[randomNumber(prefixes.length, 0)] +
affixes[randomNumber(affixes.length, 0)])
}
