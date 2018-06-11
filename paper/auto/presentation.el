(TeX-add-style-hook
 "presentation"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("beamer" "noamssymb")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("babel" "english") ("fontenc" "T1") ("mtpro2" "complete" "subscriptcorrection" "slantedGreek" "mtpfrak" "mtpbbi" "mtpcal") ("fontspec" "no-math") ("biblatex" "backend=biber" "style=authoryear-comp" "citestyle=authoryear-comp" "backref=false" "url=false" "isbn=false" "") ("enumitem" "inline") ("adjustbox" "export")))
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperref")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperimage")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperbaseurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "nolinkurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "path")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "path")
   (TeX-run-style-hooks
    "latex2e"
    "beamer"
    "beamer10"
    "inputenc"
    "babel"
    "fontenc"
    "mtpro2"
    "bm"
    "fontspec"
    "microtype"
    "bbding"
    "biblatex"
    "xfrac"
    "nicefrac"
    "enumitem"
    "tikz"
    "graphicx"
    "pgfplots"
    "wrapfig"
    "float"
    "subcaption"
    "changepage"
    "adjustbox"
    "pifont")
   (TeX-add-symbols
    '("sem" 1)
    "hand")
   (LaTeX-add-bibliographies
    "ling245"))
 :latex)

