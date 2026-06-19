+++
date = '2026-06-19T11:49:45+02:00'
draft = true
meta = true
plotly = true
math = true
title = 'Comparative Cost Theory and its Criticisms'
+++



Almost all of mainstream trade theory is articulated through comparative
advantage models, which are themselves underpinned theoretically by the
theory of comparative costs (CCT) .

## Comparative Cost Theory

CCT was first proposed by David Ricardo as a challenge to the prevailing
theories of his time, which were constructed on a notion of absolute
cost advantage. Although in its original presentation Ricardo’s theory
would appear quite heterodox nowadays (if only because Ricardo’s theory
is built on a version of the labor theory of value)the central
principles of the theory as Ricardo presented still form the foundation
of contemporary trade theory. There are three such central premises.

1.  **Labor is internationally immobile** (there is neither equalization
    of wages nor movement of qualified labor across borders).

2.  In the absence of *exogenous* forces, **capital is approximately
    internationally immobile** ($KOF-KIF \approx 0$).

3.  **The balance of payment is 0** ($CAB-AFAB=0$) since capital is
    expected to be internationally immobile this implies that the current
    account must be balanced.

The central point is that the combination of premises P.2 and P.3 implies
that the current account must be roughly balanced: if most of the time,
capital is approximately internationally immobile
($KOF-KIF \approx 0$)then the balance of payment constraint
$CAB=AFAB$ becomes $CAB \approx \Delta OR$. In other words, the
current account (and the trade balance) become constrained by the stock
of international reserves, which is by definition finite. This means
that the trade balance must be subject to a *long-run inter-temporal
budget constraint*, which leads to the conclusion that the current
account balance must follow stationary dynamics . Thus, any theory based
on comparative cost must find a way to explain how the current account
balance “*rights itself*”. Since the largest component of the current
account balance is trade, it means that CCT hinges on the existence of a
mechanism which ensures that trade flows have a tendency to balance
themselves.

Since the original proposition of , multiple versions of such a
mechanism have been proposed, but the core structure of these mechanisms
has remained largely unchanged. The idea is that there exists a
mechanism through which the real exchange rate{{< marginnote >}} Which measures “the terms of trade” for a country, in other words
    how advantageous it is to import a commodity from abroad compared to
    buying it at home. {{< /marginnote >}} for a country which
is running a trade deficit (surplus), making it easier for that country
to import (export) and to balance out the deficit (surplus). For clarity
of the argument, let us write down the China-US bilateral real exchange
rate:

$$
\begin{align}
    e_r = \frac{P_{rX}^{*} \cdot e}{P_{rX}}.
\end{align}
$$

Where $P_{rX}$ is the real export (from the US to China) price level
for the domestic (US) production, $P_{rX}^*$ is the real foreign
export (from China to US) price level and $e$ is the nominal exchange
rate (in the direct quote form, ). For this indicator to be
interpretable, the two price levelmust be computed for equivalent
consumption baskets.
<!-- 
<figure id="fig:cct-causality" data-latex-placement="!h">

<figcaption>Causal chain of the “self-righting” mechanism underlying
CCT. The causal arrow <span class="math inline">1</span> describes the
notion that a trade surplus worsens the real exchange ratearrow <span
class="math inline">2</span> describes the notion that worsened real
exchange rate to a reduced trade surplus.</figcaption>
</figure> -->

In the formulation which Ricardo originally gave, the mechanism which
ensured that trade was balanced was grounded in the quantity theory of
money. His argument went as follows : suppose a country is running
a trade surplus, this means that there is an influx of additional
foreign money in the national economy ($\Delta OR$ increases). This
influx of new money, by the quantity theory of money{{< marginnote >}} $\Delta OR$ is a component of the money supply $M$and the
    quantity theory of money asserts that $MV = PY$, assuming a
    constant velocity of money $V$ and output level $Y$, it implies
    that $M \propto P$ and thus that $\Delta OR \propto P$. {{< /marginnote >}} leads to
domestic inflation (the price level $P_{rX}$ increases), which worsens
the terms of trade: the real exchange rate $e_r$ decreases. The price
of national goods are now higher relative to goods from the rest of the
world. The final part of the argument states that worsened real exchange
rate leads to a reduction in the volume of exports, which balances out
trade ($CAB$ decreases , restoring the equilibrium).

While Ricardo’s argument works for fixed exchange rates, more
contemporary formulations are constructed to hold in a world of floating
exchange rates, without relying on the quantity theory of money. In
these argumentsa current account surplus of the domestic country
causethe nominal value of the domestic currency to appreciate, through
the action of foreign exchange markets. Thusin a situation of trade
surplus, the money inflow causes the nominal exchange rate , worsening
the terms of trade. The real exchange rate is understood to track the
nominal exchange rate, decreasing as well.

In this understanding of CCT the central aspect lies in the exchange rate
dynamics and how they relate to current account imbalances. There are
also versions of CCT which assume that payments are kept in balance
through a combination of effects on the value of currencies (inflation)
and effects on the exchange rate. Regardless of which mechanism is
posited, the assumption that some mechanism ensures balanced trade
stays central.

## Comparative Advantage Models

Models of trade based on comparative costs are called comparative
advantage models. They are usually built on two main premises: they
assume principle of comparative costs (CCT), and they also assume some
version of Say’s law .

From these two key assumption(Say’s law and CCT) comparative advantage
theory reaches the following conclusion. In a setting of unregulated
trade, domestic prices will converge to world market price(though the
action of the *law of one price*). Therefore, producers will tend to
assign productive forces under their control to sectors in which they
face lower comparative costs. In other wordsthey will tend to assign
productive forces to sectors where they can make a higher margin
relative to other sectors *domestically*. What is key here is that what
matters is the advantage relative to other sectors within the country,
not relative to the same sector in other countries.

<div id="tab:comparative_advantage">

| **country** | **sector** | **exchange rate** | **unit normal cost** (local-currency) | **world-market unit price** | **markup** |
|:---|:---|:---|:---|:---|:---|
| US | steel | `$` / `$` = 1 | $UNC_s$ = `$`4.5 | $\$10$ | $\mu_s=0.2$ |
| US | wood | `$` / `$` = 1 | $UNC_w$ = `$`4.5 | $\$5$ | $\mu_w=0.1$ |
| CN | steel | `$` / 元 = 0.2 | $UNC_s^*$ = 元 30 | $\$10$ | $\mu^*_s=0.4$ |
| CN | wood |  `$` / 元 = 0.2 | $UNC_w^*$ = 元 10 | $\$5$ | $\mu^*_w=0.6$ |

Numerical example of the comparative advantage logic, each country
specializes in the sectors in which enjoys *comparative* advantage. In
other wordssectors where markup is higher relative to other sectors in
the same country.

</div>

Let’s take an example to make the argument clearer. Say that in the
United States, it is cheaper to produce steel than wood, relative to
world market prices. If this is the casethen steel has a cost advantage
relative to wood and the margins which a company will make are higher
than a one. In this example, comparative advantage theory makes two key
predictions. Firstthat the United States will specialize in steel (see
Table <a href="#tab:comparative_advantage" data-reference-type="ref"
data-reference="tab:comparative_advantage">1</a>), because within the
national borders, it is the sector in which firms get the highest
mark-up{{< marginnote >}} Which is the same as saying it is the sector in which firms face[]
    the lowest unit normal costs relative to world market prices. {{< /marginnote >}} even if in China, the markup on the same product is higher.
This is important because this is why what matters is the *comparative*
(relative to other national sectors) advantage, not *absolute*
advantages (relative to all sectors producing equivalent goods in the ).
The second prediction is that since Say’s law applies, all productive
forces in the country will be allocated to a given activity, even if
that country is less productive than its competitors *in every possible
sector*. This is the case in the example of Table
<a href="#tab:comparative_advantage" data-reference-type="ref"
data-reference="tab:comparative_advantage">1</a>, where China
outcompetes (faces lower unit normal costs than) the US in both sectors.

One point which should be underlined here is that in the comparative
advantage model, the reason that a low productivity country is able to
successfuly sell its production on the world market is because of an
adjustment of the which necessarily entails a reduction of the domestic
real wages{{< marginnote >}} When adopting a neoclassical theoretical framework – which is what
    most modern comparative advantage models do – where real wages are
    set by the marginal productivity of labor, this is a trivial remark. {{< /marginnote >}}. Hence, trade liberalization is not expected, in the long
runto lead to job losses and underutilization of productive capacity.
What these two points entail is that through the action of the
“self-righting mechanism” of CCT *all countries are equally competitive
on the world market*. Or, as is well summarized by :

> “*International competition does not put countries out of business.
> There are strong equilibrating forces that normally ensure that any
> country remains able to sell a range of goods in world markets, and to
> balance its trade on average over the long run, even if its
> productivity, technology, and product quality are inferior to those of
> other nations \[…\] Both in theory and in practice, countries with
> lagging productivity are still able to balance their international
> trade, because what drives trade is comparative rather than absolute
> advantage*” .

In that argument, the immobility (or the low mobility) of capital
internationally is key. Indeed, it is required for the comparative
advantage argument to hold that domestic capitalists do not react to
lower absolute costabroad by reallocating their productive activities
wherever costs are lowest. This was a point recognized by , who argued
that international capital mobility was, in practice, kept in check by
“*the natural disinclination which every man has to quit the country of
his birth*”:

> “*Experience, however, shows, that the fancied or real insecurity of
> capital, when not under the immediate control of its owner, together
> with the natural disinclination which every man has to quit the
> country of his birth and connexions, and intrust himself with all his
> habits fixed, to a strange government and new laws, check the
> emigration of capital. These feelings, which I should be sorry to see
> weakened, induce most men of property to be satisfied with a low rate
> of profits in their own country, rather than seek a more advantageous
> employment for their wealth in foreign nations*” .

By introducing an adjustment mechanism that ensures that adjustment of
the real exchange rate (the “*strong equilibrating forces*” of Krugman),
the CCT assumptions specify that it is always worth it to specialize
domestically, even if the sector in which specialization happens is a
sector in which there existmore efficient producers abroad. This is
central when considering the policy prescriptions stemming from these
models. According to them, it is unambiguously beneficial for a country
to lower its trade barriers.

Without the assumptions from CCT, the ambiguity of these conclusions
breaks down. A world without CCT is one where there can exist situations
of persistent trade deficit or surplus () and a world without Say’s law
a situation of persistent unemployment of labor and capital alike (if
they are both immobile), or labor exclusively (if capital is more mobile
than labor). If both of these assumptions are , then the interaction of
both trade deficits and and capital becomes an expected outcome of
trade.

What we have discussed so far does not constitute a model *per se*. Our
specification of what gives a specific sector its comparative advantage
(lower unit normal cost relative to the world market prices) is too
vague, and different approaches to tackling this question leadto
different models of comparative advantages. In his original formulation,
, since he adhered to a version of the labor theory of value, found that
the origin of comparative advantage exclusively in differences of labor
productivity across countries and sectors. More modern acceptationof
comparative advantage, such as the Heckscher-Ohlin-Samuelson (HOS)
model, are more clearly marginalist and replace labor productivity by
the neoclassical notion of factor endowments . Early versions of the HOS
model only considered abundance of the two usual neoclassical factors
(labor and capital), but in the face the observation that goods (this is
known as the “Paradox”)to consider the abundance of “skilled” versus
“unskilled” labor (this is as the Heckscher-Ohlin-Wood framework). The
HOS framework is an example of the kind of refinements that contemporary
comparative advantage models adopt. There are other such modifications,
but the two key premises which we introduced (CCT and Say’s law) are
never abandoned .

The conclusions of comparative advantage are often presented through a
story about the benefits of specialization. A country would benefit from
reducing the amount of trade regulation it imposes, because once trade
regulations are relaxed and industry protection is dropped, the forces
of competition drive domestic producers to specialize in “*what they do
best*”. In other words, when trade is unregulatedcountries focus on the
production of the commodities in which they enjoy a comparative cost
advantage. Since Say’s law is assumedthis process of specialization is
not expected to happen at the expense of domestic employmentif it doesit
will only be a transitory process will, given enough time, dissipate on
its own. On the other hand, since trade is assumed to be balanced , the
exports of the goods in which the country is comparatively advantaged
yield the highest possible revenue ($X$ takes the maximum possible
value), with which the maximum level of imports can be brought into the
country (since ). In other wordsthe maximum level of social welfare is
attained in the setup without trade regulations. There areof course,
rigorous demonstrations of this claim by social welfare economists .
Once trade is deregulated across the worldwhat happens is a
reconfiguration of the division labor across the world in which each
country specializes, leading to productivity gains and faster growth
across the planet .

Comparative advantages provide a natural interpretation for two of the
three stylized facts which we introduced of this chapter: the increased
importance of trade in world-GDP and the increased fragmentation of
production across global production chains.

The narrative goes as followsif, under conditions of unregulated trade,
there is a tendency for countries to specialize in sectors in which they
enjoy comparative advantage (and are relatively more productive), then
trade liberalization leads to a situation in which different countries
specialize in different sectorsincreasing their interdependence.

This naturally explains the fragmentation of production as each country
specializes in a production step.

The increase in the volume of trade is then a and fragmentation of
productionas intermediaries and final goods alike now need to be shipped
across locations to join the production steps together and bring the
final goods to their consumers.

The increased volume of trade and fragmentation of production are thus
coherent with the predictions of the comparative advantage framework and
models.

The same cannot be said about the persistence of trade imbalances.

# The Problem of Imbalances

As we just saw, most of the mainstream theory of trade is constructed on
the assumption that there is a mechanism that brings trade back in
balance, ensuring that applies. When mathematically formulating a
comparative advantage model, it is indeed often simply assumed that .
But this initial assumption clashes with what appears to be the reality
of international trade: most countries run an imbalanced current account
most of the time. Balanced trade is a
historical exception rather than the rule. Naturally, by the balance of
payment identity , these current account imbalances are matched not only
by official reserve changes, but also by capital flows. This presents a
major challenge for comparative advantage theory.

As we previously discussed, the normal assumption of CCT is not that
trade is always strictly in balance, but that it is subject to a
*long-run intertemporal budget constraint*, and thus that the current
account balance must follow stationary dynamics . Here we run into an
issue: empirical economists tend to have trouble rejecting the
hypothesis that the current account balance (or the trade balance) is a
non-stationary time-series{{< marginnote >}} A stationary time-series (we write $I(0)$) is time-series which “gravitates”
    in a pattern around a specific value. In the case of the trade
    balance, if there were a mechanism that ensured balanced trade, we
    should expect the current account time-series to be stationary and
    to gravitate around , hence it should be time-series. See for proper
    definitions. {{< /marginnote >}}, especially if a relatively short
time-frame is considered (less than 50 years) . While this could be
interpreted as raising a fundamental issue with the assumption of
approximately balanced trade, the conclusion most mainstream economists
come to is that reversion to balanced trade is subject to *slow
dynamics*. For instance argue that the mean-reversion process has a ,
and thus that the amount of data required to test the stationarity of a
time-series is around 75 years. This provides an explanation of why most
countries run an imbalanced current account most of the time, but does
not address the fact that in practice, the assumption that is, most of
the time, wrong.

Implicitly, it means that the time-frame over which the comparative
advantage mechanism should be expected to work is slow as well.
Specifically, it should be expected to work as slowy as the
mean-reversion process works. Thus, it implies that policy from
comparative advantages should not be expected to come to fruition over
the , defined here as a little .

This gives us a first element to answer one of the main questions which
we asked ourselves coming into this section, that how the mainstream
(comparative advantage) theories of trade deal with the question of
imbalances. The answer is that they do not. The question of imbalances
is necessarily approached through an ad-hoc lens, a late addition to a
theoretical framework constructed on the assumption that trade
imbalances, most of the timedo not (or should not) exist.


As we shortly introduced, mainstream economists argue that combination
of slow mean-reversion dynamics and fast perturbations explains the
persistently imbalanced nature of trade. This raises a certain number of
issues. First, regardless of whether or not there exist mean-reversion
dynamics, since the predominant theory of trade assumes no imbalances,
economists make policy recommendations constructed on a no-imbalance
model, in a world where trade stays imbalanced for periods longer than
50 years. Second, the claim that reversion to the mean is occurring
(albeit slowly) does not constitute a theory for explaining actually
existing imbalances. This thus leaves the mainstream in a situation
where they must provide an explanation for the actually existing
imbalances, but where they lack a systematic approach for doing so.
Instead, mainstream economistthus construct eclectic, multifactorial
explanations which are structured as follows. First, they recognize that
the mechanism which restores the balance of trade is a very slow one,
and secondthey introduce *exogenous* mechanisms, which throw off the
balance of trade. Because of how the CCT premises are structured, these
explanations assume that exogenous forces act on the accounting
financial balancewhich in turn impacts the current account. In what
follows we explain three such *exogenous forces*, which are mobilized as
explanations US-China trade imbalances.




