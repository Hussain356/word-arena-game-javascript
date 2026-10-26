/* Word bank: category|word|hint. Difficulty is derived from word length. */
(function (root) {
  const RAW = `
tech|html|Markup language of web pages
tech|java|Language with a coffee-cup logo
tech|gpu|Chip that renders graphics
tech|mysql|Popular open-source relational database
tech|proxy|Middleman server for requests
tech|python|Language named after a comedy troupe
tech|golang|Google-made language, also called Go
tech|github|Platform for hosting Git repositories
tech|server|Computer that serves data to clients
tech|crypto|Short for digital currency or encryption
tech|browser|App used to surf the web
tech|compiler|Translates source code into machine code
tech|keyboard|Input device with keys
tech|database|Organised collection of stored data
tech|algorithm|Step-by-step procedure to solve a problem
tech|javascript|Language that makes web pages interactive
tech|framework|Reusable structure for building software
tech|encryption|Scrambling data to keep it secret
science|mars|The red planet
science|venus|Hottest planet in the solar system
science|tesla|Unit of magnetic flux density
science|gold|Element with symbol Au
science|silver|Element with symbol Ag
science|atom|Smallest unit of a chemical element
science|energy|Capacity to do work
science|gravity|Force that pulls objects together
science|oxygen|Gas we breathe to live
science|planet|Large body orbiting a star
science|molecule|Group of bonded atoms
science|galaxy|Giant system of stars like the Milky Way
science|telescope|Instrument for viewing distant stars
science|ecosystem|Community of living things and their environment
world|nepal|Home of Mount Everest
world|egypt|Land of the pyramids
world|dubai|Largest city of the UAE
world|nile|Famous river flowing through Egypt
world|island|Land surrounded by water
world|venice|Italian city built on canals
world|desert|Dry land with very little rain
world|country|A politically defined region
world|volcano|Mountain that can erupt lava
world|mountain|Very high natural elevation
world|pakistan|South Asian country with capital Islamabad
world|continent|One of Earth's seven large landmasses
fun|chess|Board game with kings and queens
fun|flute|Woodwind instrument you blow across
fun|joker|Batman's famous villain
fun|guitar|Six-stringed musical instrument
fun|hockey|Sport played with sticks and a puck or ball
fun|matrix|Sci-fi film with red and blue pills
fun|avatar|Blue-skinned Na'vi film by James Cameron
fun|cricket|Bat-and-ball sport with wickets
fun|canvas|Fabric surface for oil painting
fun|football|World's most popular sport
fun|painting|Art made with brush and colour
fun|festival|Large public celebration
daily|store|Shop where goods are sold
daily|group|A number of people or things together
daily|field|Open area of land for farming
daily|taste|Ability of the tongue to detect flavour
daily|garden|Space for growing flowers and plants
daily|pocket|Small bag sewn into clothes
daily|needle|Thin pin used for sewing
daily|feather|Light outer covering of a bird
daily|tongue|Muscle used for tasting
daily|friend|Person you trust who is not family
daily|expert|Person with extensive knowledge
daily|second|One-sixtieth of a minute
daily|meeting|Event where people come together
daily|library|Place with a collection of books
daily|comfort|Pleasant feeling of relaxation
daily|exchange|Act of trading one thing for another
daily|position|Where someone or something is located
daily|addition|Process of adding numbers
daily|statement|A declaration of something
daily|expansion|Process of growing larger
`;
  root.WORD_DATA = RAW;
  if (typeof module !== 'undefined') module.exports = RAW;
})(typeof window !== 'undefined' ? window : globalThis);
