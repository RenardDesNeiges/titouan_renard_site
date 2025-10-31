+++
date = '2025-10-31T23:28:07+01:00'
draft = false
meta = true
math = true
plotly = true
author = 'Titouan Renard'
title = 'Basics Of Input Output Analysis'
+++

The idea of this short tutorial is to give an idea of how to work with a simple 2 sector input-output table, as well as a rough idea of what the [Leontief](https://en.wikipedia.org/wiki/Wassily_Leontief) multiplier is.

The core idea of IO analysis is to model the interconnectedness of economic activities. In this short tutorial we will consider an extremely simple 2 sectors model where we have two interdependent sectors
`A` and `B` and some final demand for the output of these two sectors (they are assumed to produced a single good). Furthermore, we will assume fixed production coefficients (no substitution) which is a very common assumption in IO, and which is pretty much a correct assumption to make in the short to medium run.

## An example 2x2 IO table
An IO matrix could look like that:

|                  | Sector A | Sector B | Final Demand | Total Output |
| ---------------- | -------- | -------- | ------------ | ------------ |
| **Sector A**     | $i_{AA}$ | $i_{AB}$ | $y_A$        | $x_A$        |
| **Sector B**     | $i_{BA}$ | $i_{BB}$ | $y_B$        | $x_B$        |
| **Value Added**  | $v_A$    | $v_B$    | 0            | $x_{VA}$     |
| **Total Output** | $x_A'$   | $x_B'$   |              |              |

So this is a table which represents what each sector ouptuts for consumption in what other sector, as well as what each sectors needs for production. 

{{< plotly json="plots/DiGraph_IO_Tutorial.json" height="500px">}}

The key intution here is that the IO table is essentially (not exactly but pretty much) the adjacency matrix of a [directed graph](https://en.wikipedia.org/wiki/Directed_graph) representing the flow of goods across sectors.


The following properties hold:
<p>
$$ 
 \begin{aligned} 
	y &= v_A+v_B \\	
	y &= d_A+d_B\\
	x_A &= i_{AA}+i_{AB}+d_A\\
	x_B &= i_{BA}+i_{BB}+d_B\\
	x_A' &= i_{AA}+i_{BA}+v_A\\
	x_B' &= i_{AB}+i_{BB}+v_B\\
 \end{aligned} 
 $$
 <p>
Further more, if monetary units are used: $x_A = x_A'$ and $x_B = x_B'$ hold.

Here is a numerical example:

|                  | Sector A | Sector B | Final Demand | Total Output |
| ---------------- | -------- | -------- | ------------ | ------------ |
| **Sector A**     | 150      | 500      | 350          | 1000         |
| **Sector B**     | 200      | 100      | 1700         | 2000         |
| **Value Added**  | 650      | 1400     | 0            | 2050         |
| **Total Output** | 1000     | 2000     |              |              |

The satellite accounts associate "satellite variables" to production sectors, here we will assume they represent use of $CO_2$

|         | Sector A | Sector B | Final Demand | Total |
| ------- | -------- | -------- | ------------ | ----- |
| **CO2** | $s_A$    | $s_B$    | -            | $s_T$ |

They are most often in physical units (here in kilotons of $CO_2$), here is a numeric example:

|         | Sector A | Sector B | Final Demand | Total |
| ------- | -------- | -------- | ------------ | ----- |
| **CO2** | 50       | 25       | -            | 75    |

## Constructing the matrices

The key matrix is the technological coefficients' matrix $A$, which is constructed as follows (for a 2 sectors example):

<p>
$$ 
 \begin{aligned} 
 A=
 \begin{bmatrix} 
 \frac{ i_{AA} }{ x_A } & \frac{ i_{AB} }{ x_B' } \\ 
 \frac{ i_{BA} }{ x_A } & \frac{ i_{BB} }{ x_B' } \\
 \end{bmatrix} 
 \end{aligned} 
 $$
 In our example we have:
 $$ 
 \begin{aligned} 
 A = \begin{bmatrix} 
 0.150 & 0.250 \\ 
 0.200 & 0.050
  \end{bmatrix} 
 \end{aligned} 
 $$
</p>

Let the emission vector be given by:

$$ 
 \begin{aligned} 
 e = \begin{bmatrix} s_A & s_B \end{bmatrix} 
 \end{aligned} 
 $$

We also define the emission coefficient vector $b$ as:
$$ 
 \begin{aligned} 
 b = \begin{bmatrix} \frac{ s_A }{ x_A }&  \frac{ x_B }{ t_B } \end{bmatrix} 
 \end{aligned} 
 $$
 in our case we have:
 $$ 
 \begin{aligned} 
 b = \begin{bmatrix} 0.050 & 0.0125 \end{bmatrix} 
 \end{aligned} 
 $$
Let $x$ denote the total output vector and  $y$ the final demand vector:

<p>
 $$ 
 \begin{aligned} 
  x = \begin{bmatrix} x_A \\ x_B \end{bmatrix} &&
   y = \begin{bmatrix} d_A \\ d_B \end{bmatrix} 
 \end{aligned} 
 $$
 </p>
in our case:

<p>
 $$ 
 \begin{aligned} 
 x = \begin{bmatrix} 1000 \\ 2000 \end{bmatrix} &&
 y = \begin{bmatrix} 350 \\ 1700 \end{bmatrix} 
 \end{aligned} 
 $$
 </p>

Trivially the vector $x$ is element wise greater or equal to $y$ (because total output is final demand plus intermediary demand).

## The Leontiev mutliplier
We are now ready to compute a Leontief mutliplier $B$ :
$$ 
 \begin{aligned} 
 B = (I-A)^{-1}
 \end{aligned} 
 $$

The reason the mutliplier has this form is because it solves:
<p>
$$ 
 \begin{aligned} 
 && x &= Ax + y \\
 \iff &&  y &= (I-A)x\\
 \iff &&  x &= (I-A)^{-1}y\\
 \iff &&  x &=  By
 \end{aligned} 
 $$
</p>

We can use the multiplier to recover total output 
$t$ from final demand as follows:
<p>
$$ 
\begin{aligned} 
x = (I-A)^{-1} = B y
\end{aligned} 
$$
</p>

Numerically we have:
<p>
 $$ 
 \begin{aligned} 
 \overbrace{\begin{bmatrix} 1000 \\ 2000 \end{bmatrix} }^{=t}
 = \overbrace{\begin{bmatrix} 1.25 & 0.33 \\ 0.26 & 1.12 \end{bmatrix}}^{=(I-A)^{-1}}\cdot 
 \overbrace{\begin{bmatrix}  350 \\1700\end{bmatrix}}^{=y}
 \end{aligned} 
 $$
</p>

As per the satelite accounts they simply relate the total output to the use of the *satellite quantity*: 
<p>
 $$ 
 \begin{aligned} 
 e = x \cdot b  
 \end{aligned} 
 $$
</p>

which for a two sector model decomposes as:
<p>
 $$ 
 \begin{aligned} 
 e = \begin{bmatrix} 
 x_A \\ x_B
  \end{bmatrix} 
  \begin{bmatrix} 
  b_A & b_B
   \end{bmatrix}
 \end{aligned} 
 = \begin{bmatrix} x_A b_A\\ b_B b_B \end{bmatrix}
 = \begin{bmatrix} s_A \\ s_B \end{bmatrix}
 $$
</p>

This allows to compute total satellite variable (here the total CO2 emitted) as:
<p>
$$ 
 \begin{aligned} 
 s_ \text{tot} = b \cdot x
 \end{aligned} 
 $$
 in our 2 sectors example this is:
 $$ 
 \begin{aligned} 
 s_ \text{tot}  = s_A + s_B
 \end{aligned} 
 $$
</p>

 
 and naturally, we can plug in the expression for total output from demand to get:
<p>
 $$ 
 \begin{aligned} 
 s_ \text{tot} = b \overbrace{B y }^{=x} 
 \end{aligned} 
 $$
</p>

and hence we can get an "*emission multiplier*" $m_e$ as:
<p>
 $$ 
 \begin{aligned} 
  m_e = b\cdot B 
 \end{aligned} 
 $$
</p>

which is a vector, which allows through a scalar product to compute emissions, simply as $s_ \text{tot}= m_e\cdot y$.

## Attributing emissions per sector:

Consider the diagonal form of the vectors $b$ and $y$ (here expressed for the two sector example):
<p>
$$ 
 \begin{aligned} 
 \text{diag} (b) &= 
 \begin{bmatrix} b_A & 0 \\  0 & b_B \end{bmatrix}\\
 \text{diag} (y) &= 
 \begin{bmatrix} y_A & 0 \\  0 & y_B \end{bmatrix}\\
 \end{aligned} 
 $$
</p>
and consider the matrix $S$:

<p>
$$ 
S=
\begin{aligned} 
& \text{diag} (b) \cdot B\cdot  \text{diag}(y)
\end{aligned} 
$$
</p>

This gives us the sattelite quantities associated with production in each sector A for use in sector B:
<p>
$$ 
\begin{aligned} S=
& \begin{bmatrix} b_A & 0 \\  0 & b_B \end{bmatrix}
\begin{bmatrix} 
    b_{AA} &  b_{AB} \\  
    b_{BA} &  b_{BB} 
\end{bmatrix}
\begin{bmatrix} y_A & 0 \\  0 & y_B \end{bmatrix} 
\end{aligned} 
$$
</p>