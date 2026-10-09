# Applicability and owner intake

Collect facts that change decisions, not personal documents or credentials. Use synthetic examples when testing. The owner's answers are declarations; distinguish them from inspected evidence.

## Intake

1. What legal entity operates the system, where is it established, and what branches/representatives exist? Who decides processing purposes, and who operates on behalf of others?
2. Which countries and US states are actively targeted? Which customers are actually served? What evidence exists in advertising, shipping, currencies, sales contracts and support? Are excluded markets technically and operationally excluded, or merely absent from marketing?
3. Is this consumer, business, public-sector, education, employment, health, finance, or another regulated service? Are children likely users? Are there sensitive categories, biometrics, precise location, profiling or automated decisions?
4. Which size, revenue, processing-volume or sector facts matter to the applicable rules? Ask only relevant thresholds after selecting the source. Do not invent a threshold or confuse an exemption from one law with exemption from all laws.
5. Which repositories, sites, apps, checkout/authentication flows and deployment environments are in scope? Is source, browser testing and provider configuration access available? Who owns notices, vendor contracts and request handling?
6. Does the owner want an audit, changes, or both? Which production actions are already authorized? Where can a private report be saved?

Ask a small first batch about establishment, markets and service/audience. Follow with targeted questions discovered during inspection. Mark unanswered facts pending and continue independent inventory work. Do not demand all answers before finding obvious implementation defects.

## Decision matrix

For each market record: rule and current primary source; territorial/material applicability; establishment/targeting/processing facts; entity/sector thresholds and exemptions; effective date; controller/processor role; privacy/terminal storage/marketing/rights/accessibility branches; status (applies, potentially applies, excluded with evidence, unknown); reasoning; owner or legal decision needed.

Evaluate concurrent obligations. EU establishment can matter even for customers elsewhere; Brazil's collection/processing scope needs its own evaluation; US state residents and thresholds vary; Australian applicability is separate from the location of a pixel vendor. Mere worldwide site availability is not equivalent to actively targeting every jurisdiction. Do not assert exclusion solely because a banner offers a country selector.

A verified technical preference can be offered across markets as an engineering default. Explain that this does not resolve every lawful basis, exception or mandatory right. Geolocation can be inaccurate and itself adds processing: avoid adding a geolocation provider just to route banners without necessity and owner authorization. On uncertain geography, preserve conservative optional-service gating while researching actual obligations; never silently grant consent.

## Extend beyond the initial regions

Research national regulator and legislation, then state/province rules where relevant. Record enforcement/effective dates and distinguish proposals from enacted rules. Use current official UK ICO, Canadian OPC/provincial, Swiss FDPIC, or other jurisdiction sources when those markets are in scope. Add a dated profile with applicability, operational requirements, sources and unresolved points. The four initial profiles are a starting set, not worldwide coverage.
