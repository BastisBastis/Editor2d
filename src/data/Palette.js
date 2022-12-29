const hexs=`f2cb9b-yellow1
f2a561-yellow2
fcef8d-yellow3
e3a084-yellow4
b6f5db-green1
89d9d9-green2
b1d480-green3
80b878-green4
658d78-green5
b8b4b2-gray1
dcdac9-gray2
887d8d-gray3
5c486a-purple3
412051-purple8
72b6cf-blue1
5c8ba8-blue2
4e6679-blue3
464969-blue4
c77369-orange1
e06b51-orange2
d37b86-pink1
af5d8b-purple1
804085-purple2
5b3374-purple4
44355d-purple6
3d003d-purple7
621748-purple9
a14d55-red1
942c4b-red2
c7424f-red3
7b334c-brown1
000000-black
ffffff-white`

export const Palette={}

hexs.split("\n").forEach(s=>{
  const [hex,name]=s.split("-")
  Palette[name]={
    hex:Number("0x"+hex),
    string:"#"+hex
  }
})
