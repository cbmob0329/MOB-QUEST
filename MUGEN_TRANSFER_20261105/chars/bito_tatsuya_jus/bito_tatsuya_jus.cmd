[Defaults]
command.time = 15
command.buffer.time = 1

[Command]
name = "kick_a"
command = a
time = 1

[Command]
name = "kick_b"
command = b
time = 1

[Command]
name = "kick_c"
command = c
time = 1

[Command]
name = "super_ab"
command = a+b
time = 1

[Command]
name = "super_bc"
command = b+c
time = 1

[Command]
name = "holdfwd"
command = /$F
time = 1

[Command]
name = "holdback"
command = /$B
time = 1

[Command]
name = "holddown"
command = /$D
time = 1

[Command]
name = "holdup"
command = /$U
time = 1

[Command]
name = "recovery"
command = x+y
time = 1

[Command]
name = "FF"
command = F, F
time = 10

[Command]
name = "BB"
command = B, B
time = 10

[Command]
name = "jump"
command = $U
time = 1

[Command]
name = "highjump"
command = D, U
time = 12

[Command]
name = "run"
command = F, F
time = 10

[Command]
name = "backhop"
command = B, B
time = 10

[Command]
name = "direct_u1"
command = x
time = 1

[Command]
name = "direct_u2"
command = y
time = 1

[Command]
name = "direct_u34"
command = z
time = 1

[Command]
name = "ordinary_throw"
command = a+c
time = 1

[Statedef -1]

[State -1, Reserve human super intent before cost gate]
type = VarSet
trigger1 = 1
v = 53
value = ((command = "direct_u1" || command = "direct_u2") && command != "recovery") || (command = "holddown" && command = "direct_u34") || command = "super_ab" || command = "super_bc" || command = "ordinary_throw"


[State -1, Ordinary grounded or aerial throw]
type = ChangeState
triggerall = Alive && RoundState = 2
triggerall = Ctrl && MoveType != H
triggerall = StateNo != [120,155]
triggerall = var(41) < 4
trigger1 = AILevel = 0 && command = "ordinary_throw"
trigger1 = command != "super_ab" && command != "super_bc"
trigger1 = command != "direct_u1" && command != "direct_u2" && command != "direct_u34"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
trigger2 = NumEnemy > 0
trigger2 = P2Dist X = [0,32]
trigger2 = Abs(P2Dist Y) <= 24
value = 800

[State -1, AI deliberate crouch branch]
type = ChangeState
triggerall = AILevel > 0 && Alive && RoundState = 2
triggerall = Ctrl && StateType = S
triggerall = var(20)
trigger1 = var(24) = 1
value = 10
ctrl = 0

[State -1, AI deliberate aerial branch]
type = ChangeState
triggerall = AILevel > 0 && Alive && RoundState = 2
triggerall = Ctrl && StateType = S
triggerall = var(20)
trigger1 = var(24) = 0
value = 40
ctrl = 0

[State -1, Super 3300]
type = ChangeState
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608])))) && Power >= 2000
triggerall = StateType = A
trigger1 = AILevel = 0 && command = "holddown" && (command = "super_ab" || command = "direct_u34")
trigger2 = AILevel > 0 && var(20) && var(24) = 0
value = 3300
ctrl = 0

[State -1, Super 3200]
type = ChangeState
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608])))) && Power >= 2000
triggerall = StateType != A
trigger1 = AILevel = 0 && command = "holddown" && (command = "super_ab" || command = "direct_u34")
trigger2 = AILevel > 0 && var(20) && var(24) = 1
value = 3200
ctrl = 0

[State -1, Super 3100]
type = ChangeState
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608])))) && Power >= 1000
triggerall = StateType != A
trigger1 = AILevel = 0 && command = "super_bc" && command != "holddown"
trigger3 = AILevel = 0 && command = "direct_u2" && command != "recovery"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
value = 3100
ctrl = 0

[State -1, Super 3000]
type = ChangeState
triggerall = var(41) < 4
triggerall = MoveType != H
triggerall = StateNo != [150,155]
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608])))) && Power >= 1000
triggerall = StateType != A
trigger1 = AILevel = 0 && command = "super_ab" && command != "holddown"
trigger3 = AILevel = 0 && command = "direct_u1" && command != "recovery"
trigger2 = AILevel > 0 && var(20) && var(24) = 3
value = 3000
ctrl = 0

[State -1, Special 1300]
type = ChangeState
triggerall = var(41) < 4
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608]))))
triggerall = StateType = A
trigger1 = AILevel = 0 && command = "holddown" && command = "kick_a"
trigger2 = AILevel > 0 && var(20) && var(24) = 0
value = 1300
ctrl = 0

[State -1, Special 1200]
type = ChangeState
triggerall = var(41) < 4
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608]))))
triggerall = StateType != A
trigger1 = AILevel = 0 && command = "holddown" && command = "kick_c"
trigger2 = AILevel > 0 && var(20) && var(24) = 1
value = 1200
ctrl = 0

[State -1, Special 1100]
type = ChangeState
triggerall = var(41) < 4
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608]))))
triggerall = StateType = S
trigger1 = AILevel = 0 && command = "holdfwd" && command = "kick_b"
trigger2 = AILevel > 0 && var(20) && var(24) = 2
value = 1100
ctrl = 0

[State -1, Special 1000]
type = ChangeState
triggerall = var(41) < 4
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && (Ctrl || (MoveHit && AnimElemTime(ifelse(StateNo = 200 || StateNo = 205 || StateNo = 207,5,4)) >= 0 && ((StateNo = [200,208]) || (StateNo = [400,408]) || (StateNo = [600,608]))))
triggerall = StateType = S
trigger1 = AILevel = 0 && command = "holdfwd" && command = "kick_a"
trigger2 = AILevel > 0 && var(20) && var(24) = 3
value = 1000
ctrl = 0

[State -1, A kick a]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = A
trigger1 = AILevel = 0 && command = "kick_a"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 600
ctrl = 0

[State -1, A kick b]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = A
trigger1 = AILevel = 0 && command = "kick_b"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 603
ctrl = 0

[State -1, A kick c]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = A
trigger1 = AILevel = 0 && command = "kick_c"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 606
ctrl = 0

[State -1, C kick a]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = C
trigger1 = AILevel = 0 && command = "kick_a"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 400
ctrl = 0

[State -1, C kick b]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = C
trigger1 = AILevel = 0 && command = "kick_b"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 403
ctrl = 0

[State -1, C kick c]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = C
trigger1 = AILevel = 0 && command = "kick_c"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 406
ctrl = 0

[State -1, S kick a]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = S
trigger1 = AILevel = 0 && command = "kick_a"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 0
value = 200
ctrl = 0

[State -1, S kick b]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = S
trigger1 = AILevel = 0 && command = "kick_b"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 1
value = 203
ctrl = 0

[State -1, S kick c]
type = ChangeState
triggerall = AILevel > 0 || var(53) = 0
triggerall = RoundState = 2 && Alive && Ctrl
triggerall = StateType = S
trigger1 = AILevel = 0 && command = "kick_c"
trigger2 = AILevel > 0 && var(20) && var(24) % 3 = 2
value = 206
ctrl = 0

[State -1, Extra jump]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = A
triggerall = var(0) = 0 && Pos Y < -18
trigger1 = AILevel = 0 && command = "jump"
trigger2 = AILevel > 0 && var(23) && Vel Y > -1
value = 45
ctrl = 0

[State -1, Ground jump]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType != A
trigger1 = AILevel = 0 && (command = "jump" || command = "highjump")
trigger2 = AILevel > 0 && var(23)
value = 40
ctrl = 0

[State -1, Guard A]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = A
triggerall = StateNo != 130 && StateNo != 131 && StateNo != 132
triggerall = InGuardDist
trigger1 = AILevel = 0 && command = "holdback"
trigger2 = AILevel > 0 && var(21)
value = 122
ctrl = 0

[State -1, Guard C]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = C
triggerall = StateNo != 130 && StateNo != 131 && StateNo != 132
triggerall = InGuardDist
trigger1 = AILevel = 0 && command = "holdback"
trigger2 = AILevel > 0 && var(21)
value = 121
ctrl = 0

[State -1, Guard S]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
triggerall = StateNo != 130 && StateNo != 131 && StateNo != 132
triggerall = InGuardDist
trigger1 = AILevel = 0 && command = "holdback"
trigger2 = AILevel > 0 && var(21)
value = 120
ctrl = 0

[State -1, Guard stand to crouch]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && AILevel = 0
triggerall = StateNo = 130 && InGuardDist
trigger1 = command = "holdback" && command = "holddown"
value = 121
ctrl = 0

[State -1, Guard crouch to stand]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && AILevel = 0
triggerall = StateNo = 131 && InGuardDist
trigger1 = command = "holdback" && command != "holddown"
value = 120
ctrl = 0

[State -1, Crouch]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
trigger1 = AILevel = 0 && command = "holddown"
value = 10
ctrl = 0

[State -1, Run]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
trigger1 = AILevel = 0 && command = "run"
value = 100
ctrl = 0

[State -1, Backhop]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
trigger1 = AILevel = 0 && command = "backhop"
value = 105
ctrl = 0

[State -1, Step fwd]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
triggerall = StateNo = 0 || StateNo = 20 || StateNo = 21
triggerall = StateNo != 20
trigger1 = AILevel = 0 && command = "holdfwd"
trigger2 = AILevel > 0 && var(22)
value = 20
ctrl = 1

[State -1, Step back]
type = ChangeState
triggerall = RoundState = 2 && Alive && Ctrl && StateType = S
triggerall = StateNo = 0 || StateNo = 20 || StateNo = 21
triggerall = StateNo != 21
trigger1 = AILevel = 0 && command = "holdback"
value = 21
ctrl = 1
