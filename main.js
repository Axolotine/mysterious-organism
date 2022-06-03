// Returns a random DNA base
function returnRandBase() {
  const dnaBases = ['A', 'T', 'C', 'G'];
  return dnaBases[randInt(4)];
}

//Returns a random integer between 0 inclusive and the input exclusive
function randInt(inputInt, modifier = 0) { return Math.floor(Math.random() * inputInt) + modifier; }

// Returns a random single stand of DNA containing 15 bases
function mockUpStrand() {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
}

// I know they say to put this into a object method for the specimens but that is mystifying to me
// Coding my conscience
// Returns the score as a percent after logging the result to the console

// Mutation and DNA do not work this way - it's irritating me as an armchair biologist
function compareDNA(specimenA, specimenB){
  const lA = specimenA.dna.length;
  const lB = specimenB.dna.length;
  const lMax = (lA >= lB) ? lA : lB;
  const lMin = (lA <= lB) ? lA : lB;

  let score = 0;

  for (let i = 0; i < lMin; i++){
    if (specimenA.dna[i] === specimenB.dna[i]) { score++; }
  }
  let percentScore = Math.round(score * 100 / lMax);
  //console.log(`${specimenA.specimenNo} & ${specimenB.specimenNo} : %${percentScore}`); //debug test

  return percentScore;
}

// Returns an object representing a member of a species
// Not a huge fan of these factory functions where are my constructors
function pAequorFactory(specimenNumber, dnaSequence){
  return {
    _specimenNo : specimenNumber,
    _dna : dnaSequence,

    // set n get

    set specimenNo(input) { this._specimenNo = input },
    get specimenNo() { return this._specimenNo },
    set dna(input) { this._dna = input },
    get dna() { return this._dna },

    // methods

    //randomly selects a base and randomly mutates it, returns true
    mutate() {
      const sequence = this.dna;
      const l = sequence.length;
      const indexOfBase = randInt(l);
      const baseInitial = sequence[indexOfBase];
      const dnaBases = ['A', 'T', 'C', 'G'];
      const dnaOthers = dnaBases.filter(base => { return base != baseInitial });
      const baseChosen = dnaOthers[randInt(3)];
      
      sequence[indexOfBase] = baseChosen;
      //console.log(`Base ${baseInitial} at index ${indexOfBase} changed to ${baseChosen}.`);
      return true;
    },

    //Returns true if the DNA is made up of at least 60% G or C bases
    willLikelySurvive() {
      const sequence = this.dna;
      const max = sequence.length;
      let score = 0;

      sequence.forEach(base => {
        if (base === 'C' || base === 'G') { score++ }
      });
      let percent = Math.round(score * 100 / max);

      return percent >= 60;
    },

    //Returns the complementary sequence of bases for this particular strand of dna
    //Challenge 1
    complementStrand(){
      const sequence = this.dna;
      const indexLookup = [1, 0, 3, 2];
      const dnaBases = ['A', 'T', 'C', 'G'];

      return sequence.map(base => {
        let indexOfBase = dnaBases.indexOf(base);
        let indexOfComplement = indexLookup[indexOfBase];
        return dnaBases[indexOfComplement];
      });
    }
  };
}

//returns a sorted array of the most related individuals from an array of individuals
function findRelatives(inputArray){
  const l = inputArray.length;
  const tempArray = [];

  for (let i = 0; i < l; i++){
    for (let j = i + 1; j < l; j++){
      tempArray.push({
        partyOne : inputArray[i].specimenNo,
        partyTwo : inputArray[j].specimenNo,
        relation : compareDNA(inputArray[i], inputArray[j]),
        shout (){
          return `${this.partyOne} & ${this.partyTwo} are ${this.relation}% related!`;
        }
      });
    }
  }

  return tempArray.sort((a, b) => {
    return b.relation - a.relation;
  });
}

//main program
let complete = false;
let viableSpecimens = [];
const prefix = 'VIRTUALSAMPLE';

const nameDirector = {
  iteration : 0,
  nom (prefix) { return `${prefix}-[${this.iteration++}]` }
};

while (!complete){
  let sample = pAequorFactory(
    nameDirector.nom(prefix),
    mockUpStrand()
  );
  if (sample.willLikelySurvive()) {viableSpecimens.push(sample)};
  if (viableSpecimens.length === 30) { complete = true }
}

viableSpecimens.forEach(specimen => {
  console.log(`${specimen.specimenNo}\t${specimen.dna.join('')} | ${specimen.complementStrand().join('')}`);
});

let relations = findRelatives(viableSpecimens);

relations.forEach(comparison => { console.log(comparison.shout()) });