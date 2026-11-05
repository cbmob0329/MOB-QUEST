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
name="holdfwd"
command=/$F
time=1
buffer.time=1

[Command]
name="holdback"
command=/$B
time=1
buffer.time=1

[Command]
name="holdup"
command=/$U
time=1
buffer.time=1

[Command]
name="holddown"
command=/$D
time=1
buffer.time=1

[Command]
name="recovery"
command=x+y
time=1
buffer.time=1

[Command]
name="FF"
command=F,F
time=12
buffer.time=1

[Command]
name="BB"
command=B,B
time=12
buffer.time=1

[Command]
name="start"
command=s
time=1
buffer.time=1

[Command]
name="hold_x"
command=/x
time=1
buffer.time=1

[Command]
name="hold_y"
command=/y
time=1
buffer.time=1

[Command]
name="hold_z"
command=/z
time=1
buffer.time=1

[Command]
name="hold_a"
command=/a
time=1
buffer.time=1

[Command]
name="hold_b"
command=/b
time=1
buffer.time=1

[Command]
name="hold_c"
command=/c
time=1
buffer.time=1

[Statedef -1]

[State -1, normal S2 one dive per physical jump]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType=A && Pos Y<0 && var(56)=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=4100
value=4100
ctrl=0


[State -1, normal S3 anti-air scoop]
type = ChangeState
triggerall=!IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=4200
value=4200
ctrl=0


[State -1, normal S4 grounded retreat]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0 && var(55)=0
trigger1=var(40)=4300
value=4300
ctrl=0


[State -1, normal U1 one bar feather storm]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0 && Power>=1000
triggerall=NumEnemy>0 && (EnemyNear,ID)!=var(18) && (var(20)=0 || (var(21)<4 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=6000
value=6000
ctrl=0


[State -1, normal U2 one bar physical rising claw]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0 && Power>=1000
triggerall=NumEnemy>0 && (EnemyNear,ID)!=var(18) && (var(20)=0 || (var(21)<4 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=6100
value=6100
ctrl=0


[State -1, normal U3 committed two bar tornado]
type = ChangeState
triggerall=!IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0 && Power>=2000
triggerall=NumEnemy>0 && (EnemyNear,ID)!=var(18)
triggerall=var(20)=0 || (var(21)<4 && (EnemyNear,ID)=var(22))
trigger1=var(40)=6200
value=6200
ctrl=0


[State -1, normal U4 two-bar physical catch]
type = ChangeState
triggerall=!IsHelper && RoundState=2 && Alive && MoveType!=H && HitPauseTime=0
triggerall=(Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType!=A && Pos Y=0 && Power>=2000 && NumEnemy>0
triggerall=(EnemyNear,ID)!=var(18)
triggerall=var(20)=0 || (var(21)<4 && (EnemyNear,ID)=var(22))
trigger1=var(40)=6300
value=6300
ctrl=0


[State -1, start same-button three-stage chain]
type = VarSet
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=Ctrl || (StateNo=4000 && var(48)=1 && Time>=10) || (StateNo=4200 && var(48)=1 && Time>=30)
trigger1=var(40)=1000 || var(40)=1100 || var(40)=1200
v=12
value=ifelse(Ctrl,0,2)


[State -1, start same-button three-stage chain]
type = VarSet
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=Ctrl || (StateNo=4000 && var(48)=1 && Time>=10) || (StateNo=4200 && var(48)=1 && Time>=30)
trigger1=var(40)=1000 || var(40)=1100 || var(40)=1200
v=13
value=ifelse(var(36)=1,0,ifelse(var(36)=2,1,2))


[State -1, normal initial entry]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=Ctrl || (StateNo=4000 && var(48)=1 && Time>=10) || (StateNo=4200 && var(48)=1 && Time>=30)
trigger1=var(40)=1000 || var(40)=1100 || var(40)=1200
value=ifelse(StateNo=4200,1200,var(40))
ctrl=0


[State -1, atomic same-button followup request]
type = VarSet
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=StateNo=1000 && var(12)<2 && MoveHit>0 && Time=[9,23]
trigger1=var(38)=2 && var(40)=1000 && var(36)=ifelse(var(13)=0,1,ifelse(var(13)=1,2,4))
v=14
value=1

[State -1, same button hit-confirm stage increment]
type = VarAdd
trigger1=StateNo=1000 && var(14)=1
v=12
value=1

[State -1, same button fresh followup]
type = ChangeState
trigger1=StateNo=1000 && var(14)=1
value=1000
ctrl=0


[State -1, atomic same-button followup request]
type = VarSet
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=StateNo=1100 && var(12)<2 && MoveHit>0 && Time=[9,23]
trigger1=var(38)=2 && var(40)=1100 && var(36)=ifelse(var(13)=0,1,ifelse(var(13)=1,2,4))
v=14
value=1

[State -1, same button hit-confirm stage increment]
type = VarAdd
trigger1=StateNo=1100 && var(14)=1
v=12
value=1

[State -1, same button fresh followup]
type = ChangeState
trigger1=StateNo=1100 && var(14)=1
value=1100
ctrl=0


[State -1, atomic same-button followup request]
type = VarSet
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
triggerall=StateNo=1200 && var(12)<2 && MoveHit>0 && Time=[9,23]
trigger1=var(38)=2 && var(40)=1200 && var(36)=ifelse(var(13)=0,1,ifelse(var(13)=1,2,4))
v=14
value=1

[State -1, same button hit-confirm stage increment]
type = VarAdd
trigger1=StateNo=1200 && var(14)=1
v=12
value=1

[State -1, same button fresh followup]
type = ChangeState
trigger1=StateNo=1200 && var(14)=1
value=1200
ctrl=0


[State -1, fresh directional ordinary throw]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=Ctrl && StateType!=A && Pos Y=0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=800
value=800
ctrl=0


[State -1, fresh directional ordinary throw]
type = ChangeState
triggerall=!IsHelper && Alive && RoundState=2 && MoveType!=H && HitPauseTime=0
triggerall=Ctrl && StateType=A && Pos Y<0
triggerall=(var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20)=0 || (var(21)<4 && NumEnemy>0 && (EnemyNear,ID)=var(22)))
trigger1=var(40)=810
value=810
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType!=A && Pos Y=0 && var(26)=40
value=40
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType=A && Pos Y<=-12 && var(32)=0 && var(26)=45
value=45
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType!=A && Pos Y=0 && var(26)=100
value=100
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType!=A && Pos Y=0 && var(26)=105
value=105
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType!=A && Pos Y=0 && InGuardDist && var(26)=130
value=130
ctrl=0


[State -1, AI bounded common movement or guard]
type = ChangeState
triggerall=!IsHelper && AILevel>0 && Alive && RoundState=2 && Ctrl && MoveType!=H && HitPauseTime=0
trigger1=StateType=A && Pos Y<0 && InGuardDist && var(26)=132
value=132
ctrl=0

; APPROVED_CMD_INSERT

[State -1, S1 approved dispatch]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
triggerall = (Ctrl || ((StateNo=1000 || StateNo=1100 || StateNo=1200) && var(12)=2 && MoveHit>0 && Time=[9,23])) && StateType != A && Pos Y = 0
triggerall = (var(18)<0 || (NumEnemy>0 && (EnemyNear,ID)!=var(18))) && (var(20) = 0 || (var(21) < 4 && NumEnemy > 0 && (EnemyNear,ID) = var(22)))
trigger1 = var(40) = 4000
value = 4000
ctrl = 0

[State -1, jump]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = var(47)=1 && var(30)=0
value = 40
ctrl = 0

[State -1, airjump]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = var(47)=2
value = 45
ctrl = 0

[State -1, dash]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = Ctrl && StateType != A && command="FF"
value = 100
ctrl = 0

[State -1, backdash]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = Ctrl && StateType != A && command="BB"
value = 105
ctrl = 0

[State -1, guard]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = Ctrl && StateType != A && command="holdback" && InGuardDist
value = 130
ctrl = 0

[State -1, airguard]
type = ChangeState
triggerall = !IsHelper && RoundState = 2 && Alive && MoveType != H && HitPauseTime = 0
trigger1 = Ctrl && StateType=A && command="holdback" && InGuardDist
value = 132
ctrl = 0
