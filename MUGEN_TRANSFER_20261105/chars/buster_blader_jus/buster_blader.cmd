[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time=15
command.buffer.time=1

[Command]
name = "holdfwd"
command = /$F
time = 1
buffer.time = 1

[Command]
name = "holdback"
command = /$B
time = 1
buffer.time = 1

[Command]
name = "holdup"
command = /$U
time = 1
buffer.time = 1

[Command]
name = "holddown"
command = /$D
time = 1
buffer.time = 1

[Command]
name = "hold_x"
command = /x
time = 1
buffer.time = 1

[Command]
name = "hold_y"
command = /y
time = 1
buffer.time = 1

[Command]
name = "hold_z"
command = /z
time = 1
buffer.time = 1

[Command]
name = "hold_a"
command = /a
time = 1
buffer.time = 1

[Command]
name = "hold_b"
command = /b
time = 1
buffer.time = 1

[Command]
name = "hold_c"
command = /c
time = 1
buffer.time = 1

[Command]
name = "FF"
command = F,F
time = 10
buffer.time = 1

[Command]
name = "BB"
command = B,B
time = 10
buffer.time = 1

[Command]
name = "recovery"
command = x+y
time = 1
buffer.time = 1

[Statedef -1]

[State -1, A168 human ground air forwardhilt]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 800
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = ifelse(StateType = A,803,800)

[State -1, A168 human easy JUS 3300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 3300
trigger1 = Power >= 2000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 3300

[State -1, A168 human easy JUS 3200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 3200
trigger1 = Power >= 2000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 3200

[State -1, A168 human easy JUS 3100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 3100
trigger1 = Power >= 1000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 3100

[State -1, A168 human easy JUS 3000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 3000
trigger1 = Power >= 1000
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 3000

[State -1, A168 human easy JUS 1300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 1300
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 1300

[State -1, A168 human easy JUS 1200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 1200
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = NumHelper(18122) = 0
value = 1200

[State -1, A168 human easy JUS 1100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 1100
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 1100

[State -1, A168 human easy JUS 1000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(42) = 1000
trigger1 = Power >= 0
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = 1
value = 1000

[State -1, A168 human normal 12000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 200
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12000

[State -1, A168 human normal 12010]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 210
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12010

[State -1, A168 human normal 12020]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 220
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12020

[State -1, A168 human normal 12100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 400
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12100

[State -1, A168 human normal 12110]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 410
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12110

[State -1, A168 human normal 12120]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 420
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12120

[State -1, A168 human normal 12200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 600
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12200

[State -1, A168 human normal 12210]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 610
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12210

[State -1, A168 human normal 12220]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = var(42) = 620
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12220

[State -1, A168 fresh first jump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = Pos Y = 0
trigger1 = StateType != A
trigger1 = var(34) = 1
trigger1 = var(42) = 0
value = 40

[State -1, A168 fresh second jump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = var(32) = 0
trigger1 = Pos Y <= -12
trigger1 = var(34) = 1
trigger1 = var(42) = 0
value = 45

[State -1, A168 real FF bounded dash]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = StateNo != 100
trigger1 = command = "FF"
trigger1 = var(42) = 0
value = 100

[State -1, A168 real BB bounded retreat]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = command = "BB"
trigger1 = var(42) = 0
value = 105

[State -1, A168 human back guard]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = InGuardDist
trigger1 = command = "holdback"
trigger1 = var(42) = 0
value = 132

[State -1, A168 human back guard]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = C
trigger1 = InGuardDist
trigger1 = command = "holdback"
trigger1 = var(42) = 0
value = 131

[State -1, A168 human back guard]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = InGuardDist
trigger1 = command = "holdback"
trigger1 = var(42) = 0
value = 130

[State -1, A168 AI informed 1100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 0
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2StateType = A
trigger1 = P2Dist X = [0,65]
value = 1100

[State -1, A168 AI informed 1200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 0
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [70,145]
trigger1 = NumHelper(18122) = 0
value = 1200

[State -1, A168 AI informed 1000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 0
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [0,70]
value = 1000

[State -1, A168 AI informed 1300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 0
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = A
trigger1 = var(31) >= 8
trigger1 = P2Dist X = [0,50]
value = 1300

[State -1, A168 AI informed 3000]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 1000
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = H
trigger1 = P2Dist X = [0,70]
value = 3000

[State -1, A168 AI informed 3100]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 1000
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2Dist X = [95,185]
value = 3100

[State -1, A168 AI informed 3200]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 2000
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = H
trigger1 = P2Dist X = [40,160]
value = 3200

[State -1, A168 AI informed 3300]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = Pos Y = 0
trigger1 = Power >= 2000
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*9
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
trigger1 = P2MoveType = H
trigger1 = P2Dist X = [0,60]
value = 3300

[State -1, A168 AI visible defense]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = P2MoveType = A
trigger1 = var(31) >= 14-AILevel
trigger1 = InGuardDist
trigger1 = Random < AILevel*70
value = 132

[State -1, A168 AI visible defense]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = C
trigger1 = P2MoveType = A
trigger1 = var(31) >= 14-AILevel
trigger1 = InGuardDist
trigger1 = Random < AILevel*70
value = 131

[State -1, A168 AI visible defense]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2MoveType = A
trigger1 = var(31) >= 14-AILevel
trigger1 = InGuardDist
trigger1 = Random < AILevel*70
value = 130

[State -1, A168 AI close normal]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 60
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*40
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12200

[State -1, A168 AI close normal]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = C
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 60
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*40
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12100

[State -1, A168 AI close normal]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2Dist X = [0,55]
trigger1 = Abs(P2Dist Y) < 60
trigger1 = var(30) >= 14-AILevel
trigger1 = Random < AILevel*40
trigger1 = var(3) = 0 || (var(4) < 4 && var(17) = 0)
value = 12000

[State -1, A168 AI approach]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = P2Dist X > 90
trigger1 = var(30) > 8
value = 100

[State -1, A168 AI real jump chase]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType != A
trigger1 = P2StateType = A
trigger1 = P2Dist Y < -30
trigger1 = Random < AILevel*8
value = 40

[State -1, A168 AI second jump]
type = ChangeState
trigger1 = !IsHelper
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = MoveType != H
trigger1 = HitPauseTime = 0
trigger1 = NumEnemy = 1
trigger1 = AILevel > 0
trigger1 = Ctrl
trigger1 = StateType = A
trigger1 = var(32) = 0
trigger1 = Pos Y <= -12
trigger1 = P2Dist Y < -30
trigger1 = Random < AILevel*8
value = 45
