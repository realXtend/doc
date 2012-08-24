with the original idea here, and perhaps in any case, we need to be able to evaluate the api somehow.

can that be done by analyzing the complexity of the code implemented with it?

the games etc., but why not bundled parts of Tundra too -- they should
be the perfect examples?  EC_Light, EC_Sound, EC_SlideShow, ..? Those
are probably too simple to analyze. LVM fishgame? Circus!(?)

---


"It's very easy to create a bad API and rather difficult to create a good one."
- Michi Henning, API Design Matters, Communications of the ACM Vol. 52 No. 5
http://cacm.acm.org/magazines/2009/5/24646-api-design-matters/fulltext

https://sites.google.com/site/yacoset/Home/api-design-tips


---

The Impact of API Complexity on Failures:
An Empirical Analysis of Proprietary and
Open Source Software Systems

http://reports-archive.adm.cs.cmu.edu/anon/isr2011/CMU-ISR-11-106.pdf 

Marcelo Cataldo1, Cleidson R.B. de Souza2
June 2011
CMU-ISR-11-106
Institute for Software Research
School of Computer Science
Carnegie Mellon University
Pittsburgh, PA 15213-3890

Institute for Software Research, School of Computer Science, Carnegie Mellon University
IBM Research, Brazil

ABSTRACT 
Information hiding is a cornerstone principle of modern
software engineering. Interfaces, or APIs, are central to realizing
the benefits of information hiding, but despite their widespread use,
designing good interfaces is not a trivial activity. Particular design
choices can have a significant detrimental effect on quality or
development pro- ductivity. In this paper, we examined the impact of
API complexity on the failure proneness of source code files using
data from two large-scale systems from two distinct software companies
and nine open source projects from the GNOME community. Our analyses
showed that increases in the complexity of APIs are associated with
in- creases in the failure proneness of source code
files. Interestingly, there are significant differences between corpo-
rate and open source software. Although the impact of the complexity
of APIs is important in both settings, the magnitude of the
detrimental effects on quality is significantly higher in corporate
settings. We discuss the re- search and practical implication of the
results.

---

http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CCEQFjAA&url=http%3A%2F%2Fcs.univie.ac.at%2Fresearch%2Fresearch-groups%2Fsoftware-architecture%2Fpublikation%2Finfpub%2F2940%2F&ei=8j42UMijKIyB4ATWnoGABQ&usg=AFQjCNHGjR7QtUpnLDzH2qobfCBiAcXD6g&sig2=uMsP-fH0ta2PG5bGAhHRPw
cs.univie.ac.at/research/research-groups/software.../infpub/2940/
www.sba-research.org/wp-content/uploads/publications/gpce11.pdf

Comparing Complexity of API Designs: An Exploratory
Experiment on DSL-based Framework Integration

Abstract

Embedded, textual DSLs are often provided as an API wrapped
around object-oriented application frameworks to ease framework
integration. While literature presents claims that DSL-based appli-
cation development is beneficial, empirical evidence for this is rare.
We present the results of an experiment comparing the complex-
ity of three different object-oriented framework APIs and an em-
bedded, textual DSL. For this comparative experiment, we imple-
mented the same, non-trivial application scenario using these four
different APIs. Then, we performed an Object-Points (OP) analy-
sis, yielding indicators for the API complexity specific to each API
variant. The main observation for our experiment is that the em-
bedded, textual DSL incurs the smallest API complexity. Although
the results are exploratory, as well as limited to the given applica-
tion scenario and a single embedded DSL, our findings can direct
future empirical work. The experiment design is applicable for sim-
ilar API design evaluations.

