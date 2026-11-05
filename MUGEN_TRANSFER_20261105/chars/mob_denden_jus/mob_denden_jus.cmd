; MOB DENDEN JUS - original input dispatch, MUGEN 1.1, art-gated WIP.
; Missing native AIR/SFF bindings block playable release. No idle attack aliases.
; Six-button easy layout: a normals; b/c/x/y free1..4; z guard.
; Hold down + b/c/x/y: 3000/3100/3200/3300 supers.
; Back+b: backflip; ground c: headspin; air c: crossfire.
; Every attack/dash/jump requires var(59)=1 after asset validation.
; Human only. AI decisions are original delayed-observation controllers in ai.cns.
[Remap]
a = a
b = b
c = c
x = x
y = y
z = z
s = s

[Defaults]
command.time = 15
command.buffer.time = 1

[Command]
name = "a"
command = a
time = 1
buffer.time = 5

[Command]
name = "b"
command = b
time = 1
buffer.time = 2

[Command]
name = "c"
command = c
time = 1
buffer.time = 2

[Command]
name = "x"
command = x
time = 1
buffer.time = 2

[Command]
name = "y"
command = y
time = 1
buffer.time = 2

[Command]
name = "z"
command = z
time = 1
buffer.time = 2

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
name = "holdz"
command = /z
time = 1
buffer.time = 1

[Command]
name = "up"
command = $U
time = 1
buffer.time = 1

[Command]
name = "FF"
command = F, F
time = 10
buffer.time = 1

[Command]
name = "BB"
command = B, B
time = 10
buffer.time = 1

[Command]
name = "throw_chord"
command = a+z
time = 2
buffer.time = 1

[Command]
name = "recovery"
command = a+b
time = 1
buffer.time = 1

[Command]
name = "holda"
command = /a
time = 1
buffer.time = 1

[Statedef -1]

[State -1, Down y meter skill]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "y"
triggerall = command = "holddown"
triggerall = Ctrl || StateNo = 100
triggerall = Power >= 2000
trigger1 = 1
value = 3300

[State -1, Down x meter skill]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "x"
triggerall = command = "holddown"
triggerall = Ctrl || StateNo = 100
triggerall = Power >= 2000
trigger1 = 1
value = 3200

[State -1, Down c meter skill]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "c"
triggerall = command = "holddown"
triggerall = Ctrl || StateNo = 100
triggerall = Power >= 1000
trigger1 = 1
value = 3100

[State -1, Down b meter skill]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "b"
triggerall = command = "holddown"
triggerall = Ctrl || StateNo = 100
triggerall = Power >= 1000
trigger1 = 1
value = 3000

[State -1, Directional chord throw before auto guard]
type = ChangeState
triggerall = var(38) = 0
triggerall = NumHelper(21000) = 0
triggerall = NumHelper(21001) = 0
triggerall = NumHelper(20000) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = var(3) = 0
triggerall = NumEnemy = 1
triggerall = command = "throw_chord"
triggerall = command = "holdfwd" || command = "holdback"
triggerall = Ctrl || StateNo = 120 || StateNo = 130 || StateNo = 131 || StateNo = 132
triggerall = MoveType != H
triggerall = EnemyNear,Alive
triggerall = P2Dist X = [0,30]
triggerall = Abs(P2Dist Y) <= 28
triggerall = Pos Y = [-72,0]
triggerall = EnemyNear,Pos Y = [-72,0]
triggerall = (EnemyNear,SelfAnimExist(5000))
triggerall = (EnemyNear,SelfAnimExist(5030))
triggerall = (EnemyNear,SelfAnimExist(5050))
trigger1 = 1
value = 800

[State -1, Backflip S1 direction variant]
type = ChangeState
triggerall = var(3) = 0
triggerall = NumHelper(21000) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "b"
triggerall = command = "holdback"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
triggerall = var(10) <= 0
trigger1 = 1
value = 1100

[State -1, Four shot S1]
type = ChangeState
triggerall = var(3) = 0
triggerall = NumHelper(21000) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "b"
triggerall = command != "holdback"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
triggerall = var(10) <= 0
trigger1 = 1
value = 1000

[State -1, Air crossfire S2]
type = ChangeState
triggerall = 0 ; TEST_PROFILE_DISABLED_AIR_CROSS: corrected AC01 and six sockets unfinished
triggerall = var(3) = 0
triggerall = NumHelper(21001) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "c"
triggerall = command != "holddown"
triggerall = StateType = A
triggerall = Ctrl
triggerall = var(11) <= 0
trigger1 = 1
value = 1250

[State -1, Headspin S2]
type = ChangeState
triggerall = var(3) = 0
triggerall = NumHelper(21001) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "c"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
triggerall = var(11) <= 0
trigger1 = 1
value = 1200

[State -1, Denden punch S3]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "x"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
triggerall = var(12) <= 0
trigger1 = 1
value = 1400

[State -1, Reaction counter S4]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "y"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl
triggerall = var(13) <= 0
trigger1 = 1
value = 1300

[State -1, Third normal hit or guard confirm]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "a"
triggerall = command != "holddown"
triggerall = command != "holdz"
triggerall = StateNo = 210
triggerall = MoveContact
triggerall = Time = [10,17]
trigger1 = 1
value = 220

[State -1, LOWKICK430 terminal down-press branch after N1 contact]
type = ChangeState
triggerall = !IsHelper
triggerall = AILevel = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = var(59) = 1
triggerall = var(3) = 0
triggerall = StateType = S
triggerall = StateNo = 200
triggerall = NumEnemy = 1
triggerall = SelfAnimExist(430)
triggerall = command = "a"
triggerall = command = "holddown"
triggerall = command != "holdz"
triggerall = MoveContact
triggerall = var(23) = 1
triggerall = var(29) = 0
triggerall = var(20) + var(38) + var(6) < 4
trigger1 = Time = [8,15]
value = 430

[State -1, Second normal hit or guard confirm]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "a"
triggerall = command != "holddown"
triggerall = command != "holdz"
triggerall = StateNo = 200
triggerall = MoveContact
triggerall = Time = [8,15]
trigger1 = 1
value = 210

[State -1, Crouch jumping uppercut]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "a"
triggerall = command = "holddown"
triggerall = command != "holdz"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
trigger1 = 1
value = 400

[State -1, AIR_CHAIN clear eligibility scratch]
type = VarSet
triggerall = !IsHelper
trigger1 = 1
fv = 26
value = 0
ignorehitpause = 0

[State -1, AIR_CHAIN eligible fresh hit confirm]
type = VarSet
triggerall = AILevel = 0
triggerall = var(3) = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = NumEnemy = 1
triggerall = var(59) = 1
triggerall = StateType = A
triggerall = Pos Y < 0 || Vel Y < 0
triggerall = StateNo = 600 || StateNo = 610 || StateNo = 620
triggerall = Time = [6,12]
triggerall = MoveHit
triggerall = var(23) = 1
triggerall = var(29) = 0
triggerall = var(9) = var(21)
triggerall = var(20) + var(38) + var(6) < 4
triggerall = fvar(25) > 0
triggerall = command != "holdz"
trigger1 = 1
fv = 26
value = 1
ignorehitpause = 0

[State -1, AIR_CHAIN consume token before transition]
type = VarSet
triggerall = !IsHelper
trigger1 = fvar(26) = 1
fv = 25
value = 0
ignorehitpause = 0

[State -1, AIR_CHAIN single consumed transition]
type = ChangeState
triggerall = AILevel = 0
triggerall = var(3) = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = NumEnemy = 1
triggerall = var(59) = 1
triggerall = StateType = A
triggerall = Pos Y < 0 || Vel Y < 0
triggerall = StateNo = 600 || StateNo = 610 || StateNo = 620
triggerall = Time = [6,12]
triggerall = MoveHit
triggerall = var(23) = 1
triggerall = var(29) = 0
triggerall = var(9) = var(21)
triggerall = var(20) + var(38) + var(6) < 4
triggerall = command != "holdz"
trigger1 = fvar(26) = 1
value = IfElse(command = "holdfwd" && SelfAnimExist(640),640,StateNo + 10)
ignorehitpause = 0

[State -1, DROPKICK640 neutral-air forward press]
type = ChangeState
triggerall = !IsHelper
triggerall = AILevel = 0
triggerall = Alive
triggerall = RoundState = 2
triggerall = var(59) = 1
triggerall = var(3) = 0
triggerall = NumEnemy = 1
triggerall = StateType = A
triggerall = Pos Y < 0 || Vel Y < 0
triggerall = Ctrl
triggerall = command = "a"
triggerall = command = "holdfwd"
triggerall = command != "holdz"
triggerall = SelfAnimExist(640)
triggerall = var(29) = 0
triggerall = var(20) + var(38) + var(6) < 4
trigger1 = 1
value = 640

[State -1, Air normal]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "a"
triggerall = command != "holdz"
triggerall = StateType = A
triggerall = Ctrl
trigger1 = 1
value = 600

[State -1, Gun butt normal starter]
type = ChangeState
triggerall = var(3) = 0
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "a"
triggerall = command != "holddown"
triggerall = command != "holdz"
triggerall = StateType != A
triggerall = Ctrl || StateNo = 100
trigger1 = 1
value = 200

[State -1, Ground guard button]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "holdz" || (command = "holdback" && InGuardDist)
triggerall = StateType != A
triggerall = Ctrl
triggerall = StateNo != 120
trigger1 = 1
value = 120

[State -1, Forward dash]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "FF"
triggerall = StateType != A
triggerall = Ctrl
triggerall = command != "holddown"
trigger1 = 1
value = 100

[State -1, Backstep]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "BB"
triggerall = StateType != A
triggerall = Ctrl
triggerall = command != "holddown"
trigger1 = 1
value = 105

[State -1, Second jump fresh press]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "up"
triggerall = StateType = A
triggerall = Ctrl
triggerall = var(0) < 2
trigger1 = 1
value = 45

[State -1, First jump fresh press]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = var(59) = 1
triggerall = command = "up"
triggerall = StateType != A
triggerall = Ctrl
triggerall = command != "holddown"
triggerall = var(0) = 0
trigger1 = 1
value = 40

[State -1, Crouch direction]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = command = "holddown"
triggerall = StateType != A
triggerall = Ctrl
triggerall = StateNo != 10
trigger1 = 1
value = 10

[State -1, Walk direction]
type = ChangeState
triggerall = AILevel = 0
triggerall = RoundState = 2
triggerall = Alive
triggerall = !IsHelper
triggerall = command = "holdfwd" || command = "holdback"
triggerall = command != "holddown"
triggerall = StateType != A
triggerall = Ctrl
triggerall = StateNo != 20
trigger1 = 1
value = 20

