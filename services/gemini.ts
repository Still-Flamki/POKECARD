
import { Realm } from "../types";

export const getRealmData = async (realm: Realm) => {
  const localData: Record<Realm, any> = {
    [Realm.ZEKROM]: {
      element: "Electric / Dragon",
      powerLevel: 98,
      state: "Deep Black Ideals",
      loreSnippet: "A legendary Pokémon that scorched the world with lightning when people lost their sense of ideals.",
      traits: ["Teravolt", "Fusion Bolt", "Noble Presence"]
    },
    [Realm.PIKACHU]: {
      element: "Electric",
      powerLevel: 85,
      state: "Overcharged",
      loreSnippet: "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
      traits: ["Static", "Lightning Rod", "Surge Force"]
    },
    [Realm.CHARIZARD]: {
      element: "Fire / Flying",
      powerLevel: 94,
      state: "Molten Core Alpha",
      loreSnippet: "It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.",
      traits: ["Blaze", "Solar Power", "Inferno Overdrive"]
    },
    [Realm.MEWTWO]: {
      element: "Psychic",
      powerLevel: 99,
      state: "Genetic Peak",
      loreSnippet: "A Pokémon created by genetic manipulation. Its psychic power is said to be the strongest among all Pokémon.",
      traits: ["Pressure", "Unnerve", "Psystrike"]
    },
    [Realm.SQUIRTLE]: {
      element: "Water",
      powerLevel: 70,
      state: "Hydro Flux",
      loreSnippet: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
      traits: ["Torrent", "Rain Dish", "Hydro Pump"]
    },
    [Realm.BULBASAUR]: {
      element: "Grass / Poison",
      powerLevel: 65,
      state: "Sprout Phase",
      loreSnippet: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
      traits: ["Overgrow", "Chlorophyll", "Solar Beam"]
    },
    [Realm.WOBBUFFET]: {
      element: "Psychic",
      powerLevel: 80,
      state: "Kinetic Counter",
      loreSnippet: "It hates light and shock. If attacked, it inflates its body to pump up its counterstrike.",
      traits: ["Shadow Tag", "Telepathy", "Mirror Coat"]
    },
    [Realm.GENGAR]: {
      element: "Ghost / Poison",
      powerLevel: 92,
      state: "Shadow Bound",
      loreSnippet: "It hides in shadows. It is said that if Gengar is hiding, it cools the area by nearly 10 degrees F.",
      traits: ["Cursed Body", "Shadow Tag", "Night Shade"]
    },
    [Realm.MAGNETON]: {
      element: "Electric / Steel",
      powerLevel: 88,
      state: "Tri-Polarity",
      loreSnippet: "A link of three Magnemite, it emits powerful radio waves that can cause high-voltage headaches.",
      traits: ["Magnet Pull", "Sturdy", "Flash Cannon"]
    },
    [Realm.SNORLAX]: {
      element: "Normal",
      powerLevel: 89,
      state: "Deep Hibernation",
      loreSnippet: "Snorlax's typical day consists of nothing but eating and sleeping. It is such a docile Pokémon that children use its big belly as a place to play.",
      traits: ["Thick Fat", "Immunity", "Giga Impact"]
    }
  };
  
  return { ...localData[realm], isFallback: true };
};
