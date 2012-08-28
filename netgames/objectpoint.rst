tuollaisessa o jotain tuollaisia queryjä millä laskevat niitä
OP:eita, Repository Based Software Cost Estimation (2007) 
http://de.scientificcommons.org/42759941

Based on this schema the following P-OQL query determines the object-
points for a project named \Clearing" .
(sum
 (select ((count C:_.has_attr->.
 ((2 * count C:*.relation->.)
...

P-OQL: an OQL-oriented Query Language for PCTE (1995) 
http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.26.3442

(sum
// add Class-Points
(select ((count C:_.has_attr->.
+ ((2 * count C:*.relation->.)
+ (3 * count C:_.has_method->.)))
* C:novelty)
from P in Project, C in (P: {c}]+/->.)
where P:name = "Clearing" and C:. is of type Class)
+ (sum
// add Message-Points
(select ((count M:/_.has_parameter->. + 4)
* (M:novelty
* (case M:complexity = LOW
==> +0.75,
M:complexity = MEDIUM ==> +1.00,
M:complexity = HIGH
==> +1.25)))
from P in Project, M in (P: {c}]+/_.sends_message_to->.)
where P:name = "Clearing")
+ sum
// add Process-Points
(select (((case Pc:process_type = SYSTEM
==> 6,
Pc:process_type = BATCH
==> 2,
Pc:process_type = ONLINE
==> 4,
Pc:process_type = REALTIME ==> 8)
+ Pc:variants)
* (case Pc:complexity = LOW
==> +0.75,
Pc:complexity = MEDIUM ==> +1.00,
Pc:complexity = HIGH
==> +1.25))
from P in Project, Pc in (P: {c}]+->.)
where P:name = "Clearing" and Pc:. is of type Proce
