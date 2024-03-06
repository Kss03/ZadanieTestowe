const { stdin: input, stdout: output } = require('node:process');
const rl = require('readline-sync');
const fs = require('node:fs')

async function Main() {
  let fileName: string
  let fileData: string
  let dataArr: string[]

  console.log('Wprowadz nazwe pliku z tego samego katalogu')
  fileName = await rl.question('Nazwa pliku: ')
  try {
    fileData = fs.readFileSync(`${__dirname}/${fileName}`, 'utf8');
    dataArr = fileData.split(/\r?\n/)
  } catch (e) {
    return errFunc()
  }

  session.team1 = new Team()
  session.team2 = new Team()
  const team1 = session.team1
  const team2 = session.team2

  if (!isValidName(dataArr[0])) return errFunc()
  team1.name = dataArr[0]
  if (!isValidSpeed(dataArr[1])) return errFunc()
  team1.speed = Number(dataArr[1])
  if (!isValidName(dataArr[2])) return errFunc()
  team2.name = dataArr[2]
  if (!isValidSpeed(dataArr[3])) return errFunc()
  team2.speed = Number(dataArr[3]) * -1
  if (!isValidField(dataArr[4])) return errFunc()
  session.xSize = Number(dataArr[4])
  if (!isValidField(dataArr[5])) return errFunc()
  session.ySize = Number(dataArr[5])

  session.setStartPosition()
  while (!session.result) {
    session.move()
  }
  console.log(session.result)
}

Main()

// functions
interface Session {
  result: string
  xSize: number
  ySize: number
  team1: Team
  team2: Team
  setStartPosition: () => void
  checkPosition: () => void
  checkWinner: () => void | string
  move: () => void
}

class Team {
  name: string
  speed: number
  figuresPos: any[]

  moveEven(index: number) {
    // nieparzysty index
    this.figuresPos[index] = this.figuresPos[index] + this.speed
  }
  moveOdd(index: number) {
    // parzysty index
    if (this.speed < 0) this.figuresPos[index] = this.figuresPos[index] - Math.pow(2, Math.abs(this.speed))
    if (this.speed > 0) this.figuresPos[index] = this.figuresPos[index] + Math.pow(2, Math.abs(this.speed))
  }
  moveFigure(index: number) {
    if (Number(this.figuresPos[index]) != this.figuresPos[index]) return
    if (index % 2 == 0) this.moveEven(index)
    if (index % 2 == 1) this.moveOdd(index)
  }
  setStartPos(xSize: number, yPos: number) {
    this.figuresPos = []
    if (xSize === 1) {
      this.figuresPos[0] = yPos
      return
    }
    for (let i = 0; i < xSize; i++) {
      this.figuresPos[i] = yPos
    }
  }
}

const session: Session = {
  move() {
    for (let i = 0; i < this.team1.figuresPos.length; i++) {
      this.team1.moveFigure(i)
      this.team2.moveFigure(i)
    }
    this.checkPosition()
    this.checkWinner()
  },
  setStartPosition() {
    const isOddEven = this.xSize == 1 ? 1 : 2
    this.team1.setStartPos(isOddEven, 0)
    this.team2.setStartPos(isOddEven, this.ySize - 1)
    this.checkPosition()
    this.checkWinner()
  },
  checkPosition() {
    for (let i = 0; i < this.team1.figuresPos.length; i++) {
      if (this.team1.figuresPos[i] === this.team2.figuresPos[i]) {
        const t1 = Math.abs(this.team1.speed)
        const t2 = Math.abs(this.team2.speed)
        if (t1 > t2) this.team2.figuresPos[i] = null
        if (t1 < t2) this.team1.figuresPos[i] = null
        if (t1 == t2) {
          this.team1.figuresPos[i] = null
          this.team2.figuresPos[i] = null
        }
      }
      if (this.team1.figuresPos[i] >= session.ySize) this.team1.figuresPos[i] = null
      if (this.team2.figuresPos[i] < 0) {
        this.team2.figuresPos[i] = null
      }
    }
  },
  checkWinner() :string {
    let check1 = this.team1.figuresPos.filter(item => Number(item) === item).length
    let check2 = this.team2.figuresPos.filter(item => Number(item) === item).length
    if (check1 == 0 && check2 == 0) {
      this.result =  "remis"
      return
    }
    if (check1 == 0 && check2 !=0) {
      this.result = this.team2.name
      return
    }
    if (check2 == 0 && check1 != 0) {
      this.result = this.team1.name
      return
    }
  }
} as Session

const errFunc = ():void => console.log('error')

function isValidName(name: string): boolean {
  const reg = /[a-zA-Z0-9]/g
  name = name.trim()
  if (!name || name.length > 10) return false
  let checkVar: string[] = name.match(reg)
  return name.length === checkVar.length;
}

function isValidSpeed (input: string): boolean {
  let num = Number(input)
  if (!num) return false
  if (num >=1 && num <= 3) return true
}

function isValidField (input: string): boolean {
  let num = Number(input)
  if (!num) return false
  if (num >=1 && num <= 1000) return true
}
