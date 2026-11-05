[Remap]
x=x
y=y
z=z
a=a
b=b
c=c
s=s
[Defaults]
command.time = 15
command.buffer.time = 2

[Command]
name = "super"
command = ~D, DF, F, x+y
time = 25

[Command]
name = "super"
command = ~D, DF, F, a+b
time = 25

[Command]
name = "beam"
command = ~D, DF, F, x
time = 20

[Command]
name = "beam"
command = ~D, DF, F, a
time = 20

[Command]
name = "rush"
command = ~D, DB, B, x
time = 20

[Command]
name = "rush"
command = ~D, DB, B, a
time = 20

[Command]
name = "FF"
command = F,F
time = 10

[Command]
name = "BB"
command = B,B
time = 10

[Command]
name = "recovery"
command = x+y
time = 1

[Command]
name = "recovery"
command = a+b
time = 1

[Command]
name = "a"
command = a
time = 1

[Command]
name = "b"
command = b
time = 1

[Command]
name = "c"
command = c
time = 1

[Command]
name = "a"
command = x
time = 1

[Command]
name = "b"
command = y
time = 1

[Command]
name = "c"
command = z
time = 1

[Command]
name = "s"
command = s
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
name = "holdup"
command = /$U
time = 1

[Command]
name = "holddown"
command = /$D
time = 1

[Command]
name = "super"
command = a+b+c
time = 3

[Command]
name = "super"
command = x+y+z
time = 3

[Command]
name = "beam"
command = a+c
time = 3

[Command]
name = "beam"
command = x+z
time = 3

[Command]
name = "rush"
command = b+c
time = 3

[Command]
name = "rush"
command = y+z
time = 3

[Command]
name = "counter"
command = a+b
time = 3

[Command]
name = "counter"
command = x+y
time = 3

[Command]
name = "pull"
command = ~D, DF, F, b
time = 25

[Command]
name = "pull"
command = ~D, DF, F, y
time = 25

[Command]
name = "counter"
command = ~D, DB, B, b
time = 25

[Command]
name = "counter"
command = ~D, DB, B, y
time = 25

[Command]
name = "barrage"
command = ~D, DF, F, c
time = 25

[Command]
name = "barrage"
command = ~D, DF, F, z
time = 25

[Command]
name = "nova"
command = ~D, DB, B, c
time = 25

[Command]
name = "nova"
command = ~D, DB, B, z
time = 25

[Statedef -1]

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 200 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 201 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 210 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 211 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 220 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 221 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 400 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 401 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 410 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 411 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 420 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 421 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 600 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 601 && Time >= 2 && command = "a"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 610 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 611 && Time >= 2 && command = "b"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 620 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1

[State -1, Combo buffer fresh tap]
type = VarSet
trigger1 = !IsHelper && StateNo = 621 && Time >= 2 && command = "c"
v = 25
value = 1
ignorehitpause = 1


[State -1, abyss nova]
type = ChangeState
value = 3200
triggerall = !IsHelper && RoundState = 2
triggerall = command = "nova" || (command = "super" && command = "holdback")
triggerall = Power >= 2000 && StateType != A
trigger1 = Ctrl

[State -1, eye barrage]
type = ChangeState
value = 3100
triggerall = !IsHelper && RoundState = 2
triggerall = command = "barrage" || (command = "super" && command = "holddown")
triggerall = Power >= 1000 && StateType != A
trigger1 = Ctrl
trigger2 = StateNo = [200,210]
trigger2 = MoveContact

[State -1, absorption]
type = ChangeState
value = 3000
triggerall = !IsHelper && RoundState = 2
triggerall = command = "super"
triggerall = Power >= 1000 && NumHelper(7000) = 0
triggerall = StateType != A
trigger1 = Ctrl
trigger2 = StateNo = [200,220]
trigger2 = MoveContact

[State -1, suction wave]
type = ChangeState
value = 1300
triggerall = !IsHelper && RoundState = 2
triggerall = command = "pull" || (command = "beam" && command = "holddown")
triggerall = StateType != A
trigger1 = Ctrl
trigger2 = StateNo = [200,210]
trigger2 = MoveContact

[State -1, millennium counter]
type = ChangeState
value = 1200
triggerall = !IsHelper && RoundState = 2
triggerall = command = "counter"
triggerall = StateType != A
trigger1 = Ctrl

[State -1, charged eye beam]
type = ChangeState
value = 1000
triggerall = !IsHelper && RoundState = 2
triggerall = command = "beam"
triggerall = StateType != A
trigger1 = Ctrl
trigger2 = StateNo = [200,210]
trigger2 = MoveContact

[State -1, claw rush]
type = ChangeState
value = 1100
triggerall = !IsHelper && RoundState = 2
triggerall = command = "rush" && StateType != A
trigger1 = Ctrl
trigger2 = StateNo = [200,210]
trigger2 = MoveContact

[State -1, forward glide]
type = ChangeState
value = 100
triggerall = !IsHelper && RoundState = 2
trigger1 = command = "FF" && StateType = S && Ctrl

[State -1, back glide]
type = ChangeState
value = 105
triggerall = !IsHelper && RoundState = 2
trigger1 = command = "BB" && StateType = S && Ctrl


[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 200 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 201
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 201 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 202
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 210 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 211
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 211 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 212
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 220 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 221
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 221 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 222
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 400 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 401
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 401 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 402
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 410 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 411
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 411 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 412
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 420 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 421
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 421 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 422
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 600 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 601
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 601 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 602
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 610 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 611
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 611 && var(25) && MoveContact && Time >= 5 && Time <= 19
value = 612
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 620 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 621
ignorehitpause = 1

[State -1, Combo same-button followup]
type = ChangeState
trigger1 = !IsHelper && RoundState = 2 && StateNo = 621 && var(25) && var(26) && Time >= 5 && Time <= 19
value = 622
ignorehitpause = 1


[State -1, Combo mixed chain terminal]
type = ChangeState
trigger1 = !IsHelper && RoundState=2 && StateNo=210 && MoveContact && command="c"
value = 222
ignorehitpause = 1

[State -1, air a]
type = ChangeState
value = 600
triggerall = !IsHelper && RoundState = 2
triggerall = command = "a" && StateType = A
trigger1 = Ctrl

[State -1, low a]
type = ChangeState
value = 400
triggerall = !IsHelper && RoundState = 2
triggerall = command = "a" && StateType != A && command = "holddown"
trigger1 = Ctrl

[State -1, standing a]
type = ChangeState
value = 200
triggerall = !IsHelper && RoundState = 2
triggerall = command = "a" && StateType != A
trigger1 = Ctrl

[State -1, air b]
type = ChangeState
value = 610
triggerall = !IsHelper && RoundState = 2
triggerall = command = "b" && StateType = A
trigger1 = Ctrl
trigger2 = StateNo = 600 && MoveContact

[State -1, low b]
type = ChangeState
value = 410
triggerall = !IsHelper && RoundState = 2
triggerall = command = "b" && StateType != A && command = "holddown"
trigger1 = Ctrl
trigger2 = StateNo = 400 && MoveContact

[State -1, standing b]
type = ChangeState
value = 210
triggerall = !IsHelper && RoundState = 2
triggerall = command = "b" && StateType != A
trigger1 = Ctrl
trigger2 = StateNo = 200 && MoveContact

[State -1, air c]
type = ChangeState
value = 620
triggerall = !IsHelper && RoundState = 2
triggerall = command = "c" && StateType = A
trigger1 = Ctrl

[State -1, low c]
type = ChangeState
value = 420
triggerall = !IsHelper && RoundState = 2
triggerall = command = "c" && StateType != A && command = "holddown"
trigger1 = Ctrl

[State -1, standing c]
type = ChangeState
value = 220
triggerall = !IsHelper && RoundState = 2
triggerall = command = "c" && StateType != A
trigger1 = Ctrl
trigger2 = StateNo = 210 && MoveContact

[State -1, AI super]
type = ChangeState
value = 3000
triggerall = !IsHelper && RoundState = 2
triggerall = AILevel > 0 && Ctrl && StateType != A
triggerall = Power >= 1000 && NumHelper(7000) = 0
trigger1 = P2BodyDist X < 105 && Random < 18

[State -1, AI claw]
type = ChangeState
value = 200
triggerall = !IsHelper && RoundState = 2
triggerall = AILevel > 0 && Ctrl && StateType != A
trigger1 = P2BodyDist X < 42 && Random < 100

[State -1, AI followup]
type = ChangeState
value = 210
triggerall = !IsHelper && RoundState = 2
triggerall = AILevel > 0
trigger1 = StateNo = 200 && MoveContact

[State -1, AI beam]
type = ChangeState
value = 220
triggerall = !IsHelper && RoundState = 2
triggerall = AILevel > 0 && Ctrl && StateType != A
trigger1 = P2BodyDist X > 60 && Random < 30
