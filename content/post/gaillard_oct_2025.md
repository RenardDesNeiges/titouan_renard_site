+++
date = '2025-10-31T13:13:27+01:00'
draft = false
meta = true
math = true
plotly = true
author = 'Titouan Renard'
title = 'The Swiss Debt Brake: Making Sense of an Apparent Paradox'
+++


Switzerland is planning deep cuts to public services, education, and research. They are implemented by virtue of the so called "debt brake," a rule designed to prevent overspending. But here’s a puzzle: Switzerland has less debt than its neighbours and, by many expert accounts, has plenty of financial room to manoeuver. So why is it choosing austerity? This apparent paradox is one worth pondering about in a situation of increased economic uncertainty in the face of the Trump 2.0 initiated tarifs. In this short note I argue that the two most conventional explanation on the matter do not hold: the kind of austerity politics led by Switzerland is neither *necessary* (for financial stability) nor *madness* (as some conversly argue). I argue that investigating this issue is only possible by looking at the relationships of production themselves. In other words the push for budget cuts might have less to do with pure economics than with protecting a certain political and economic order.

# The Gaillard Budget Cuts
<!-- Figure 1. UNIGE personal mobilisation against the budget cuts
recommended by Gaillard et al. (2024). -->
{{< plotly json="plots/Gaillard_BudgetCut_By_Categories.json" height="400px">}}

The contents of the report “*re-examining the tasks and subsidies*” of the Swiss Confederation lay down a roadmap for what almost looks like an austerity program {{< marginnote >}}Gaillard, Serge, Jacques Bourgeois, Aymo Brunetti, Christoph Schaltegger, and Ursula Schneider Schüttel. « Réexamen 2024 des tâches et des subventions - Rapport à l’attention du Conseil fédéral », 25 août 2024.{{< /marginnote >}}. The proposition to cut down the total spending of the state by 4.9 CHF billion / year by 2030, which has led to mobilisation, especially the education sector, implies drastic reductions of spending in key areas of the confederation’s public policy, including but not limited to: climate and energy, research and integration of asylum.

Astonishingly, out of 66 pages, the report dedicates a mere 6 to justifying why public spending should be cut. In short, the motivation for the limitation of public spending boils down to the application of the constitutionally enforced debt brake, a legislative device explicitly aimed at preventing the confederation from accumulating debt. In view of the authors of the report, the argumentation for slashing public spending thus goes as follows. Noting that the COVID-19 pandemic and the economic consequences of the Ukraine war have caused an increase in the Confederation’s spending relative to its income, the authors conclude that “*if no corrective action is taken, this increase will lead to major structural deficits in the years to come*” {{< marginnote >}}*Ibid.* p.3 (Unless mentioned otherwise, all translations into English are of by the author.){{< /marginnote >}}. Since the prevailing wisdom states that any increase in taxation level should be avoided{{< marginnote >}} It is worth mentioning that a small section of the report is
dedicated to the evaluation of an alternative scenario where fiscal
revenue is lightly increased, allowing for a slightly less aggressive
reduction of spending. But even in that alternative scenario, public
spending is massively reduced. {{< /marginnote >}}, the only way to comply with the constitutional obligation to balance the budget imposed by the debt brake is a massive slashing of public spending. In the following critical summary, I will investigate the rationale behind such budget cuts and present a critical view of it. This will lead us to an apparent paradox: why does a state with relatively few constraints on its fiscal space, such as Switzerland, choose to limit its actions and forgo the possible benefits of greater state intervention? Concluding, I will attempt to make sense of this paradox by turning our attention to the political aspects of *austerian* policies.

# *Sound* Finance
{{< plotly json="plots/Gaillard_Debt_To_GDP_creditors.json" height="400px">}}

The section of the report dedicated to the debt brake provides us with
some insight into the rationale behind such a policy instrument. Following a very orthodox implementation of the New Keynesian view on fiscal policy, the authors explain that the arguments for imposing such a hard constraint on public spending are twofold. First, the authors argue that reducing the debt increases *fiscal space*. They write that “*a low debt ratio also provides ample room for manoeuvre for fiscal policy in the long term, which is particularly desirable in view of the continuing ageing of the population and its foreseeable consequences for social insurance*”{{< marginnote >}}*Ibid.* p.13{{< /marginnote >}}. Second, they argue that the debt break acts as an automatic stabilizer “*it allows cyclical deficits in periods of under-utilisation of production capacity and requires cyclical surpluses in periods of over-utilisation*”{{< marginnote >}}*Ibid.* p.13{{< /marginnote >}}. According to this view, in “*normal times*”, the debt brake allows the government to accumulate surpluses, reducing the debt, which in “*extraordinary circumstances such as severe economic crises*”, gives more room for action to the federal government to spend accordingly. This argumentation provides us with a prime example of the *sound finance* conception of fiscal space. In this paradigm, money is assumed to be an exogenous medium of exchange, limited in supply. Often supporters of this view also assume some version of the *quantity theory of money* which posits that the velocity of money is constant and that any increase in the quantity of money will translate into an increase of prices (inflation). These views lead the supporters of the sound finance paradigm to argue that the government spending must originate in the private sector. Governments are thus understood to be subject to the same intertemporal constraints as enterprises and households and need to ensure that revenue covers their expenses. These constraints are a consequence of the government’s budget, which must satisfy the following accounting equation:

{{< marginpar >}}Where $G$ stands for non-interests government spending, $i \cdot B$ for the payment of existing interests on the debt, $T$ for tax revenue, $\Delta B$ for new government debt and $\Delta M_h$ for newly created monetary base.{{< /marginpar >}}
$$
\begin{aligned}
(1) && G + i\cdot B ≡ T + \Delta B + \Delta M_h
\end{aligned}
$$

The aforementioned assumptions (exogenous money supply, the quantity theory of money) imply that the main limitation of fiscal space is the accumulation of debt. Passed a certain level of debt, most of the government’s budget would go to paying interests, and the government would have to refinance its debt either by further borrowing, possibly at an increasing cost or by creating new monetary base, at the risk of creating inflation. In the *sound finance* paradigm, both of these possibilities are what concretely limit fiscal space {{< marginnote >}}For an example of this view in practice, take a look at: Ghosh, Atish R., Jun I. Kim, Enrique G. Mendoza, Jonathan D. Ostry, and Mahvash S. Qureshi. ‘Fiscal Fatigue, Fiscal Space and Debt Sustainability in Advanced Economies’. *The Economic Journal* 123, no. 566 (2013): F4–30.{{< /marginnote >}}. The idea of the debt brake is thus to constrain the augmentation of the debt in “normal” times to preserve the government’s ability to contract more debt in the future, ensuring there is plenty of available *fiscal space* to be used in times of crisis. This is why it is argued that the debt brake acts as an automatic stabiliser{{< marginnote >}}Pfeil, Christian F., and Lars P. Feld. ‘Does the Swiss Debt Brake Induce Sound Federal Finances? A Synthetic Control Analysis’. *Public Finance Review* 52, no. 1 (January 2024): 3–41. <https://doi.org/10.1177/10911421231191566>.{{< /marginnote >}}.


<!-- {{</* plotly json="/plots/Gaillard_Debt_To_GDP_creditors.json" height="400px" */>}} -->

The effect of the debt brake is clearly visible when comparing the Swiss
debt level to that of its European neighbours. Here, it
is worth noting that with a public "*debt to GDP ratio*"{{< marginnote >}}Here we write "*debt to GDP ratio*" in quotes because it should be argued that it is not, in fact, a ratio but rather a measurement of Debt in years of GDP (for instance France has a bit more than a year of its own GDP worth of debt).{{< /marginnote >}} of 39% (in 2024),
the confederation has a debt much lower than its European neighbours
(the same year, the French debt to GDP ratio was 116%, Germany’s 64% and
Italy’s 148%) all of which are managing to sustain their debt burden.
But of course, the argument behind the debt brake is not that the debt
should be kept sustainable at a given time, but rather that it should be
kept low to ensure the ability to accumulate sustainable debt in times
of crisis. In that regard, empirical assessments of debt sustainability
within the *sound finance* paradigm will not allow us to construct a
proper criticism of the logic behind the debt break. To do so, we will
rather question fundamental theoretical argument underlying its
implementation, in other words, whether the level of public debt really
is constraining a government’s fiscal space.

# Functional Finance

<!-- <img src="media/image3.jpg" style="width:6.29444in;height:3.14722in" />

Figure 3. (a) Debt-to-GDP ratio of the Swiss government (the vertical line marks the adoption of the debt brake). (b) European countries’ fiscal space and productive capacity indices, data from Assa and Morgan . -->

Following the seminal work of Abba Lerner{{< marginnote >}}Lerner, Abba P. ‘Functional Finance and the Federal Debt’. *Social Research* 10, no. 1 (1943): 38–51. {{< /marginnote >}}, Post-Keynesian and Modern Monetary Theory authors{{< marginnote >}}Assa, Jacob, and Marc Morgan. « The General Relativity of Fiscal Space: Theory and Applications ». *Review of Political Economy*, 24 avril 2025, 1‑35. <https://doi.org/10.1080/09538259.2025.2479732>. </br> Mitchell, William, L. Randall Wray, and Martin J. Watts.*Macroeconomics*. London: Macmillan International Higher Education, 2019. {{< /marginnote >}} have argued against the fundamental assumptions of the *sound finance* view we laid out above. Arguing that money is, in fact, not an exogenous and limited in supply means of exchange, but rather an endogenous, credit-created liability, with a value which is backed by the state’s taxation policy, they reject the view that states’ finances must be managed as if states were a household or an enterprise. Indeed unlike *currency users* (enterprises, households), *currency issuers* can spend more than they can earn, as they can issue currency in the first place, which makes them by definition the most solvent actor in the entire national economy{{< marginnote >}}As long as their debt is denominated in the currency they control, which is not the case in many developping countries or when considering EMU member countries.{{< /marginnote >}}. This leads to conclusions opposed to those of the *sound finance* paradigm: for instance, a state should avoid maintaining a positive balance for a sufficiently long period of time as it may create an unsustainable accumulation of debt in the private sector. This is not a problem in Switzerland, as the country has a large current account balance surplus, which explains why such a policy as the debt brake has been sustainable. This delineates a completely different view on fiscal and monetary policy, one where “*government fiscal policy, its spending and taxing, its borrowing and repayment of loans, its issue of new money and its withdrawal of money, shall all be undertaken with an eye only to the results of these actions on the economy and not to any established traditional doctrine about what is sound or unsound*” {{< marginnote >}}Lerner, Abba P. ‘Functional Finance and the Federal Debt’. p.39{{< /marginnote >}}. We refer to this perspective as *functional finance*.

While the *functional finance* paradigm makes it clear that countries which have sufficient monetary sovereignty have a much larger freedom in their usage of fiscal space, it is not immediately evident what are the actual limits to fiscal space in this view. Assa and Morgan{{< marginnote >}}Assa, Jacob, and Marc Morgan. « The General Relativity of Fiscal Space: Theory and Applications ». *Review of Political Economy*, 24 avril 2025, 1‑35. <https://doi.org/10.1080/09538259.2025.2479732>.{{< /marginnote >}} attempt to give an assessment of what are the actual determinants of fiscal space in that view. Following the arguments of Keynes’{{< marginnote >}}Keynes, John Maynard. *How To Pay For The War*. Macmillan and co ltd, 1940.{{< /marginnote >}} famous pamphlet “*How to pay for the war*” they argue that inflation is not to be understood as a monetary phenomenon, but rather as a the *pressure valve* of an economy hitting the limits of its productive capacity, which can happen for a great multitude of reasons, supply chain constraints, class struggle, etc.. Unemployment on the other hand, relates to underutilisation of the economy’s productive capacities. Finally, the ability of a government to spend deeply relate to the country’s monetary sovereignty which depends not only on whether the country emits its own currency, but also on factors such as foreign exchange reserve, foreign-currency denominated debt and high inelastic imports. In summary Assa and Morgan (2025) propose that fiscal space can be written by the following equation:

{{< marginpar >}}Where $\mu$ is the unemployment rate, $\pi$ the level of inflation, $m$ a measure of monetary sovereignty and $\rho$ a measure of productive capacity.{{< /marginpar >}}
$$
G = f(\mu+,\pi-,m+,\rho -)
$$

The fiscal space thus increases with unutilized productive
capacity (unemployment), with greater productive capacity and with
greater monetary sovereignty, on the other hand it decreases as
inflation increases as inflation indicates that the productive capacity
saturates. Assa and Morgan (2025) propose a methodology for estimating
the fiscal capacity of a sovereign country: they compute a *fiscal
space* index (FSI), a value between 0 (very low *fiscal space*) and 1
(extremely high *fiscal space*) which estimate how free a country is in
using their *fiscal space*. According to their computations, Switzerland
is the European country with the largest *fiscal space* index, thanks to
large productive capacities, an independent central bank, large foreign
currency reserves, and low foreign-currency-denominated debt (Figure 3.
(b)).

# What “Pure Economics” cannot explain: the Apparent Irrationality of Austerian policies 

This inquiry into the constraints on fiscal space lead us to conclude that the rationale behind the debt brake, and consequently Gaillard’s proposed budget cuts, is flawed. Switzerland is not effectively safeguarding its *fiscal space* or better preparing for future crises by reducing its debt during “normal” times. There is thus an apparent irrationality in the fact that the government is not using that available fiscal space (to foster growth, to invest in new technologies, to increase redistribution). I argue that what underlies the implementation of such a measure cannot be explained from a “pure economics” point of view. To understand the *austerian* policy package, we need to look at the *political aspects* {{< marginnote >}}Kalecki, Michał ‘Political Aspects of Full Employment’. *The Political Quarterly* 14, no. 4 (October 1943): 322–30. <https://doi.org/10.1111/j.1467-923X.1943.tb01016.x>.{{< /marginnote >}} of its
implementation.

While the financial rigour imposed by the debt brake has far less brutal effects than austerity programmes such as those imposed on southern Eurozone countries during the debt crisis or on European countries after the First World War, I posit that these *austerian* policies share the same ideological roots. Like debt brakes, austerity does not 'work' in the sense that it does not solve the problems it claims to solve (reducing debt and restoring growth through austerity and accelerating growth and avoiding crises through debt brakes). Nevertheless, governments keep implementing these policies. Authors such as Mark Blyth {{< marginnote >}}Blyth, Mark. *Austerity: The History of a Dangerous Idea*. Oxford University Press, 2015{{< /marginnote >}} view this repeated, seemingly paradoxical pattern as a form of madness. This conclusion, however, is an admittance of defeat in analysing the issue, which I argue is a consequence of failing to understand the inherently unnatural character of the social relations of production{{< marginnote >}}Marx, Karl, Martin Nicolaus, and Karl Marx. *Grundrisse: Foundations of the Critique of Political Economy (Rough Draft)*. 23. print. Penguin Classics, 2012 \[1857\].{{< /marginnote >}}. Building on Clara Mattei{{< marginnote >}}Mattei, Clara E. *The Capital Order: How Economists Invented Austerity and Paved the Way to Fascism*. University of Chicago Press, 2022. <https://doi.org/10.7208/chicago/9780226818405.001.0001>.{{< /marginnote >}}’s arguments, I propose that *austerian* policies at large {{< marginnote >}}By *austerian* policies at large I mean « hard » austerity measures and financial rigour policies alike. {{< /marginnote >}} are not primarily focused on managing economic parameters such as growth rates, inflation, and unemployment. Instead, they are concerned with the fundamental relationships of production, specifically private ownership of productive capital and the relationship between owners and workers. From this perspective, the only way to properly understand these policies is to stop viewing them as a “*sincere toolbox for managing the economy*”{{< marginnote >}}Clara Mattei 2024 *The Capital Order* p.4.{{< /marginnote >}}, and instead to conceptualise the *austerian* policy package as a set of *fiscal, monetary and industrial guardrails* that protect capitalist social relations.

Indeed, while a given country may have access to much more *fiscal space* than the *sound finance* view suggests, using that *fiscal space* to its full extent would clearly show the deeply political nature of capitalist relations, opening the door for contesting said relations. Clara Mattei{{< marginnote >}}*Ibid.*{{< /marginnote >}} provides a clear example of how strong state intervention posed a significant threat to European powers following the First World War. The war demonstrated that unemployment, working hours and wages could be managed politically, thereby revealing that economic forces never operate independently of political dynamics. This demonstrated that the living standards demanded by the proletariat could be achieved through political action. Austerity was deployed in response to these demands, and its main effect — disempowering the majority and increasing their dependence on wages — proved successful in stabilising class relations. But Switzerland is not in a state crisis of capitalist relations. It would, of course, be a mistake to assimilate the current state of social relations in Switzerland to that of European countries coming out of the First World War. So, what motivates the implementation
of such a program in that case?

I argue that *austerian* policies are deployed by the Swiss government
*because it can*. Indeed, as we have briefly touched on when discussing
the country’s positive foreign account balance, aggregate demand in
Switzerland is kept high by the country’s insertion in the international
division of labour. There is therefore little need to act on aggregate
demand to preserve economic growth. Furthermore, for reasons which are
beyond this short paper’s scope, there is very little organised pushback
on *austerian* policies within Switzerland. There is therefore not a
high cost in implementing them, and on the other hand, there are
advantages, such as the efficiency of these policies in increasing the
dependence of workers on their wages, in ensuring that wealth transfers
are kept in check, as well as favouring the privatisation of as many
services as possible. From that point of view becomes that those
policies are not irrational, they produce an ensemble of effects which
sanctify capitalist social relations, making them appear as natural, and
thus have a direct impact on the social order which in turn preserves
current and future profits.

---

This discussion was first written in the context of Prof. [Marc Morgan](https://www.marc-morgan.eu/)'s class "*Growth Distribution and Politics, Empirical Perspectives*" I have here adapted it a bit and took the time to update the data. 