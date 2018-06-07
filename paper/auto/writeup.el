(TeX-add-style-hook
 "writeup"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("article" "10pt")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("babel" "english") ("geometry" "margin=1in") ("fontenc" "T1") ("mtpro2" "complete" "subscriptcorrection" "slantedGreek" "mtpfrak" "mtpbbi" "mtpcal") ("fontspec" "no-math") ("biblatex" "backend=biber" "style=authoryear-comp" "citestyle=authoryear-comp" "backref=false" "hyperref=true" "url=false" "isbn=false" "") ("enumitem" "inline") ("hyperref" "hidelinks" "breaklinks")))
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperref")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperimage")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperbaseurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "nolinkurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "path")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "path")
   (TeX-run-style-hooks
    "latex2e"
    "article"
    "art10"
    "inputenc"
    "babel"
    "geometry"
    "fontenc"
    "mtpro2"
    "bm"
    "fontspec"
    "microtype"
    "amsthm"
    "mathtools"
    "bbding"
    "biblatex"
    "xfrac"
    "nicefrac"
    "enumitem"
    "tikz"
    "pgfplots"
    "wrapfig"
    "float"
    "subcaption"
    "multicol"
    "chngcntr"
    "titlesec"
    "adjustbox"
    "hyperref")
   (TeX-add-symbols
    '("sem" 1))
   (LaTeX-add-labels
    "sec:things-note"
    "sec:introduction"
    "sec:experiment"
    "sec:method"
    "sec:results"
    "tab:barresults"
    "sec:discussion")
   (LaTeX-add-bibliographies
    "ling245"))
 :latex)

