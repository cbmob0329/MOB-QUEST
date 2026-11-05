; Minotaur self-authored inputs; no foreign choreography.
[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time=18
command.buffer.time=3

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
name = "recovery"
command = x+y
time = 1
buffer.time = 1

[Command]
name = "start"
command = s
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
name = "FF"
command = F,F
time = 10
buffer.time = 3

[Command]
name = "BB"
command = B,B
time = 10
buffer.time = 3

[Command]
name = "super_a"
command = D,DF,F,D,DF,F,x
time = 28
buffer.time = 3

[Command]
name = "super_b"
command = D,DB,B,D,DB,B,y
time = 28
buffer.time = 3

[Command]
name = "charge"
command = D,DF,F,z
time = 18
buffer.time = 3

[Command]
name = "throw_c"
command = c
time = 1
buffer.time = 1

[Statedef -1]

[State -1, ordinary A throw c fresh press]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime && Ctrl
triggerall = StateType=A && Pos Y<0
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
trigger1 = AILevel=0 && command="throw_c"
trigger2 = AILevel>0 && NumEnemy>0 && (P2BodyDist X=[10,50]) && Random<20
value = 810
ctrl = 0


[State -1, ordinary S throw c fresh press]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime && Ctrl
triggerall = StateType!=A && Pos Y=0
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
trigger1 = AILevel=0 && command="throw_c"
trigger2 = AILevel>0 && NumEnemy>0 && (P2BodyDist X=[10,50]) && Random<20
value = 800
ctrl = 0


[State -1, 27logical routes same button 1200]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel=0 && var(42)=1200
trigger1 = Ctrl
trigger2 = StateNo=1200 && var(12)<2 && MoveHit>0 && Time=[10,18]
value = 1200
ctrl = 0

[State -1, CPU bounded three actual strikes 1200]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel>0 && StateType=A && NumEnemy>0
trigger1 = Ctrl && (P2BodyDist X=[0,55]) && Random<50
trigger2 = StateNo=1200 && var(12)<2 && MoveHit>0 && Time=10
value = 1200
ctrl = 0


[State -1, 27logical routes same button 1100]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel=0 && var(42)=1100
trigger1 = Ctrl
trigger2 = StateNo=1100 && var(12)<2 && MoveHit>0 && Time=[10,18]
trigger3 = StateNo=4000 && MoveHit>0 && Time=[19,24]
value = 1100
ctrl = 0

[State -1, CPU bounded three actual strikes 1100]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel>0 && StateType=C && NumEnemy>0
trigger1 = Ctrl && (P2BodyDist X=[0,55]) && Random<50
trigger2 = StateNo=1100 && var(12)<2 && MoveHit>0 && Time=10
value = 1100
ctrl = 0


[State -1, 27logical routes same button 1000]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel=0 && var(42)=1000
trigger1 = Ctrl
trigger2 = StateNo=1000 && var(12)<2 && MoveHit>0 && Time=[10,18]
trigger3 = StateNo=4000 && MoveHit>0 && Time=[19,24]
value = 1000
ctrl = 0

[State -1, CPU bounded three actual strikes 1000]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall = var(58)=GameTime
triggerall = var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
triggerall = AILevel>0 && StateType=S && NumEnemy>0
trigger1 = Ctrl && (P2BodyDist X=[0,55]) && Random<50
trigger2 = StateNo=1000 && var(12)<2 && MoveHit>0 && Time=10
value = 1000
ctrl = 0


[State -1, approved U4 down b two bars no fallback]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0 && Power >= 2000
triggerall = var(20) = 0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22))
trigger1 = AILevel = 0 && var(42) = 6300
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [15,65]) && Random < 8
value = 6300
ctrl = 0


[State -1, approved U3 two bar down a no fallback]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0 && Power >= 2000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 6200
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [65,175]) && Random < 8
value = 6200
ctrl = 0


[State -1, approved U2 one bar no insufficient fallback]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0 && Power >= 1000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 6100
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [55,145]) && Random < 12
value = 6100
ctrl = 0


[State -1, approved U1 one bar no insufficient fallback]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0 && Power >= 1000
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 6000
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [15,65]) && Random < 12
value = 6000
ctrl = 0


[State -1, approved S4]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 4300
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [25,65]) && Random < 20
value = 4300
ctrl = 0


[State -1, approved S3]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 4200
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [55,115]) && Random < 25
value = 4200
ctrl = 0


[State -1, approved S2]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime && (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 4100
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [12,52]) && P2StateType != A && Random < 25
value = 4100
ctrl = 0


[State -1, approved S1]
type = ChangeState
triggerall = fvar(21) = 0 || var(21) <= fvar(22)
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = var(58) = GameTime
triggerall = (Ctrl || ((StateNo=1000 || StateNo=1100) && var(12)=2 && MoveHit>0 && Time=[10,18])) && StateType != A && Pos Y = 0
triggerall = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = AILevel = 0 && var(42) = 4000
trigger2 = AILevel > 0 && NumEnemy > 0 && (P2BodyDist X = [15,60]) && Random < 30
value = 4000
ctrl = 0


[State -1, Minotaur human ordinary back guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = command = "holdback"
triggerall = command != "holddown"
trigger1 = 1
value = 130
ctrl = 0

[State -1, Minotaur human low guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = command = "holdback"
triggerall = command = "holddown"
trigger1 = 1
value = 131
ctrl = 0

[State -1, Minotaur human air guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = InGuardDist
triggerall = command = "holdback"
trigger1 = 1
value = 132
ctrl = 0

[State -1, Minotaur CPU visible guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = P2StateType != C
triggerall = var(31) > 17 - AILevel
triggerall = var(30) >= 17 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 130
ctrl = 0
triggerall = var(31) >= 17 - AILevel

[State -1, Minotaur CPU visible low guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType != A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = P2StateType = C
triggerall = var(31) > 17 - AILevel
triggerall = var(30) >= 17 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 131
ctrl = 0
triggerall = var(31) >= 17 - AILevel

[State -1, Minotaur CPU visible air guard]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = A
triggerall = InGuardDist
triggerall = P2MoveType = A
triggerall = var(31) > 17 - AILevel
triggerall = var(30) >= 17 - AILevel
triggerall = Random < 180 + AILevel * 85
trigger1 = 1
value = 132
ctrl = 0
triggerall = var(31) >= 17 - AILevel


[State -1, R16 round snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 200
v = 0
value = RoundNo

[State -1, R16 victim snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 200
v = 1
value = EnemyNear, ID

[State -1, R16 round snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 210
v = 0
value = RoundNo

[State -1, R16 victim snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 210
v = 1
value = EnemyNear, ID

[State -1, R16 round snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 220
v = 0
value = RoundNo

[State -1, R16 victim snapshot]
type = VarSet
trigger1 = AILevel = 0
trigger1 = RoundState = 2
trigger1 = Alive
trigger1 = Life > 0
trigger1 = !IsHelper
trigger1 = var(58) = GameTime
trigger1 = HitPauseTime = 0
trigger1 = Ctrl
trigger1 = StateType = S
trigger1 = Pos Y = 0
trigger1 = NumEnemy = 1
trigger1 = (EnemyNear, Alive)
trigger1 = P2StateType != A
trigger1 = P2StateType != L
trigger1 = P2Dist Y = 0
trigger1 = var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear, ID) = var(22))
trigger1 = var(42) = 220
v = 1
value = EnemyNear, ID

[State -1, JUS human ground token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = RoundState = 2
triggerall = Alive
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = AILevel = 0
triggerall = StateType != A
triggerall = Pos Y = 0
triggerall = var(34) = 1
triggerall = StateNo = 0 || StateNo = 11 || StateNo = 20 || StateNo = 21 || StateNo = 100
trigger1 = 1
v = 47
value = 1

[State -1, JUS human ground jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
trigger1 = var(47) = 1
value = 40
ctrl = 0

[State -1, JUS human air token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = RoundState = 2
triggerall = Alive
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(32) = 0
triggerall = Pos Y <= -Const(movement.airjump.height)
triggerall = AILevel = 0
triggerall = var(57) > 0
trigger1 = 1
v = 47
value = 2

[State -1, JUS human air jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
trigger1 = var(47) = 2
value = 45
ctrl = 0

[State -1, JUS CPU air token]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = VarSet
triggerall = RoundState = 2
triggerall = Alive
triggerall = Ctrl
triggerall = MoveType != H
triggerall = var(38) = 0
triggerall = var(42) = 0
triggerall = StateType = A
triggerall = StateNo = 50
triggerall = var(32) = 0
triggerall = Pos Y <= -Const(movement.airjump.height)
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = EnemyNear, Alive
triggerall = var(30) >= 14 - AILevel
triggerall = P2Dist X = [35,110]
triggerall = P2Dist Y < -20
triggerall = Random < 10 + AILevel * 8
trigger1 = 1
v = 47
value = 2

[State -1, JUS CPU air jump]
triggerall = !IsHelper
triggerall = HitPauseTime = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = MoveType != H
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
trigger1 = var(47) = 2
value = 45
ctrl = 0

[State -1, Minotaur human run]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "FF"
trigger1 = 1
value = 100
ctrl = 0

[State -1, Minotaur human backstep]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "BB"
trigger1 = 1
value = 105
ctrl = 0

[State -1, Minotaur CPU approach]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = StateNo != 100
triggerall = var(30) >= 17 - AILevel
triggerall = P2BodyDist X > 65
triggerall = P2MoveType != A
trigger1 = 1
value = 100
ctrl = 0

[State -1, Minotaur CPU ground jump]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel > 0
triggerall = NumEnemy > 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = var(30) >= 17 - AILevel
triggerall = P2StateType = A
triggerall = P2Dist Y < -20
triggerall = P2BodyDist X = [20,100]
triggerall = Random < 30 + AILevel * 20
trigger1 = 1
value = 700
ctrl = 0
triggerall = !Ctrl || Time >= 7
triggerall = !IsHelper
triggerall = HitPauseTime = 0

[State -1, Minotaur human taunt]
type = ChangeState
triggerall = StateNo < 12200 || StateNo > 12222
triggerall = RoundState = 2
triggerall = Alive
triggerall = MoveType != H
triggerall = AILevel = 0
triggerall = Ctrl
triggerall = StateType = S
triggerall = command = "start"
trigger1 = 1
value = 195
ctrl = 0
