import { useState } from "react";
import { Upload, Save, FileText, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Document {
  id: string;
  name: string;
  category: string;
  uploadDate: string;
}

interface ManualEntry {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const Learning = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Regulamento_Credito_2024.pdf",
      category: "Crédito",
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Manual_Seguros.pdf",
      category: "Seguros",
      uploadDate: "2024-01-10",
    },
  ]);

  const [manualEntries, setManualEntries] = useState<ManualEntry[]>([
    {
      id: "1",
      title: "Processo de Aprovação de Crédito",
      content: "O processo de aprovação segue as seguintes etapas: 1) Análise de documentação...",
      updatedAt: "2024-01-20",
    },
  ]);

  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<string | null>(null);

  const handleSaveManual = () => {
    if (!manualTitle.trim() || !manualContent.trim()) return;

    if (editingEntry) {
      setManualEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry
            ? { ...entry, title: manualTitle, content: manualContent, updatedAt: new Date().toISOString().split('T')[0] }
            : entry
        )
      );
      setEditingEntry(null);
    } else {
      const newEntry: ManualEntry = {
        id: Date.now().toString(),
        title: manualTitle,
        content: manualContent,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setManualEntries((prev) => [...prev, newEntry]);
    }

    setManualTitle("");
    setManualContent("");
  };

  const handleEditEntry = (entry: ManualEntry) => {
    setManualTitle(entry.title);
    setManualContent(entry.content);
    setEditingEntry(entry.id);
  };

  const handleDeleteEntry = (id: string) => {
    setManualEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-coop-chat-bg overflow-y-auto">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 shadow-sm sticky top-0 z-10">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Aprendizado</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Gerencie documentos e conhecimento manual do sistema
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Section 1: Documents */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-coop-sidebar flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                Documentos da Cooperativa
              </h3>
              <Button className="bg-coop-sidebar hover:bg-coop-sidebar/90 text-sidebar-foreground gap-2 text-sm sm:text-base w-full sm:w-auto">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Enviar novo documento</span>
                <span className="sm:hidden">Enviar documento</span>
                {/* TODO: Integrar com backend para processar documentos e enviar para base vetorial */}
              </Button>
            </div>

            <Card className="bg-card rounded-2xl shadow-md p-4 sm:p-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 mb-4 sm:mb-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-muted-foreground" />
                <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                  Clique para fazer upload ou arraste arquivos aqui
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, XLSX, PNG, JPG (máx. 10MB)
                </p>
              </div>

              {/* Documents Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[600px]">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="pb-3 px-4 sm:px-0 text-xs sm:text-sm font-semibold text-foreground">Documento</th>
                      <th className="pb-3 text-xs sm:text-sm font-semibold text-foreground">Categoria</th>
                      <th className="pb-3 text-xs sm:text-sm font-semibold text-foreground hidden md:table-cell">Última Atualização</th>
                      <th className="pb-3 pr-4 sm:pr-0 text-xs sm:text-sm font-semibold text-foreground text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 sm:py-4 px-4 sm:px-0 text-xs sm:text-sm text-foreground truncate max-w-[200px]">{doc.name}</td>
                        <td className="py-3 sm:py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                          {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 sm:py-4 pr-4 sm:pr-0">
                          <div className="flex gap-1 sm:gap-2 justify-end">
                            <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" onClick={() => handleDeleteDocument(doc.id)} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* Section 2: Manual Knowledge */}
          <section>
            <h3 className="text-lg sm:text-xl font-semibold text-coop-sidebar mb-4 flex items-center gap-2">
              🧠 Conhecimento Manual
            </h3>

            <Card className="bg-card rounded-2xl shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Título do conteúdo
                  </label>
                  <Input
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Título do conteúdo"
                    className="bg-background text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                    Conteúdo
                  </label>
                  <Textarea
                    value={manualContent}
                    onChange={(e) => setManualContent(e.target.value)}
                    placeholder="Digite aqui manuais, instruções, procedimentos ou informações importantes para o aprendizado do sistema..."
                    rows={6}
                    className="bg-background resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleSaveManual}
                    disabled={!manualTitle.trim() || !manualContent.trim()}
                    className="bg-coop-sidebar hover:bg-coop-sidebar/90 text-sidebar-foreground gap-2 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Save className="h-4 w-4" />
                    {editingEntry ? "Atualizar aprendizado" : "Salvar aprendizado"}
                    {/* TODO: Enviar texto manual para API e indexar no banco de conhecimento */}
                  </Button>

                  {editingEntry && (
                    <Button
                      onClick={() => {
                        setEditingEntry(null);
                        setManualTitle("");
                        setManualContent("");
                      }}
                      variant="outline"
                      className="text-sm sm:text-base w-full sm:w-auto"
                    >
                      Cancelar edição
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Manual Entries List */}
            <div className="space-y-3 sm:space-y-4">
              {manualEntries.map((entry) => (
                <Card key={entry.id} className="bg-card rounded-xl shadow-sm p-4 sm:p-5">
                  <div className="flex justify-between items-start gap-3 mb-2 sm:mb-3">
                    <h4 className="text-sm sm:text-base font-semibold text-foreground flex-1 min-w-0">{entry.title}</h4>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => handleEditEntry(entry)}
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 break-words">
                    {entry.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Última atualização: {new Date(entry.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Learning;
